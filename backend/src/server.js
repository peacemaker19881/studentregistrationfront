import "dotenv/config";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import bcrypt from "bcryptjs";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import multer from "multer";
import xlsx from "xlsx";
import { authenticate, createToken, requireRole } from "./auth.js";
import { initializeDatabase, pool } from "./db.js";

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error("JWT_SECRET must be set to a random value of at least 32 characters.");
}

const app = express();
const port = Number(process.env.PORT || 4000);
const here = path.dirname(fileURLToPath(import.meta.url));
const uploadRoot = path.resolve(here, "../uploads");
const documentsPath = path.join(uploadRoot, "documents");
const newsPath = path.join(uploadRoot, "news");
const origins = (process.env.FRONTEND_ORIGINS || "http://localhost:5173")
  .split(",").map(value => value.trim()).filter(Boolean);

fs.mkdirSync(documentsPath, { recursive: true });
fs.mkdirSync(newsPath, { recursive: true });

app.disable("x-powered-by");
app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    if (!origin || origins.includes(origin)) return callback(null, true);
    return callback(new Error("This website is not allowed to access the API."));
  }
}));
app.use(express.json({ limit: "1mb" }));
app.use("/uploads", express.static(uploadRoot, { dotfiles: "deny", index: false, maxAge: "1h" }));

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { message: "Too many login attempts. Please try again later." }
});

function diskUpload(destination, maxBytes, extensions) {
  return multer({
    storage: multer.diskStorage({
      destination,
      filename: (_req, file, callback) => callback(null, `${crypto.randomUUID()}${path.extname(file.originalname).toLowerCase()}`)
    }),
    limits: { fileSize: maxBytes, files: 1 },
    fileFilter: (_req, file, callback) => {
      if (!extensions.has(path.extname(file.originalname).toLowerCase())) {
        return callback(new Error(`Allowed file types: ${[...extensions].join(", ")}.`));
      }
      callback(null, true);
    }
  });
}

const documentUpload = diskUpload(documentsPath, 20 * 1024 * 1024, new Set([".pdf", ".doc", ".docx", ".ppt", ".pptx", ".xls", ".xlsx"]));
const imageUpload = diskUpload(newsPath, 5 * 1024 * 1024, new Set([".jpg", ".jpeg", ".png", ".webp"]));
const marksUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, callback) => path.extname(file.originalname).toLowerCase() === ".xlsx"
    ? callback(null, true)
    : callback(new Error("Upload an .xlsx workbook."))
});

const text = value => typeof value === "string" ? value.trim() : "";
const validEmail = value => typeof value === "string" && value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const validText = (value, limit) => typeof value === "string" && value.trim().length > 0 && value.trim().length <= limit;

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

app.post("/api/auth/register", async (req, res, next) => {
  const body = req.body || {};
  const fields = ["fullname", "sex", "dob", "address", "parent_phone", "trade", "level"];
  if (!fields.every(key => validText(body[key], key === "address" ? 255 : 160)) ||
      !validEmail(body.email) || typeof body.password !== "string" ||
      body.password.length < 8 || body.password.length > 72) {
    return res.status(400).json({ message: "Enter all student details, a valid email, and a password of at least 8 characters." });
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(body.dob) || Number.isNaN(Date.parse(body.dob))) {
    return res.status(400).json({ message: "Enter a valid date of birth." });
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const email = text(body.email).toLowerCase();
    const [user] = await connection.execute(
      "INSERT INTO users (email, password_hash, role) VALUES (?, ?, 'student')",
      [email, await bcrypt.hash(body.password, 12)]
    );
    const registrationNumber = `STU-${new Date().getFullYear()}-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
    const [student] = await connection.execute(
      `INSERT INTO students
       (user_id, registration_number, fullname, sex, dob, address, parent_phone, trade, level, email)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [user.insertId, registrationNumber, text(body.fullname), text(body.sex), body.dob, text(body.address),
        text(body.parent_phone), text(body.trade), text(body.level), email]
    );
    await connection.commit();
    res.status(201).json({
      message: "Student account created. You can now sign in.",
      student: { id: student.insertId, registration_number: registrationNumber }
    });
  } catch (error) {
    await connection.rollback();
    if (error.code === "ER_DUP_ENTRY") return res.status(409).json({ message: "An account with that email already exists." });
    next(error);
  } finally {
    connection.release();
  }
});

app.post("/api/auth/login", loginLimiter, async (req, res, next) => {
  const email = text(req.body?.email).toLowerCase();
  const password = req.body?.password;
  if (!validEmail(email) || typeof password !== "string") {
    return res.status(400).json({ message: "Enter a valid email and password." });
  }
  try {
    const [rows] = await pool.execute(
      `SELECT u.id, u.email, u.password_hash, u.role, s.id AS student_id,
              s.fullname, s.registration_number
       FROM users u LEFT JOIN students s ON s.user_id = u.id WHERE u.email = ? LIMIT 1`,
      [email]
    );
    const user = rows[0];
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ message: "Email or password is incorrect." });
    }
    res.json({
      token: createToken(user),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        student_id: user.student_id || null,
        fullname: user.fullname || null,
        registration_number: user.registration_number || null
      }
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/auth/me", authenticate, async (req, res, next) => {
  try {
    const [rows] = await pool.execute(
      `SELECT u.id, u.email, u.role, s.id AS student_id, s.fullname, s.registration_number
       FROM users u LEFT JOIN students s ON s.user_id = u.id WHERE u.id = ?`,
      [req.user.sub]
    );
    if (!rows[0]) return res.status(401).json({ message: "Account not found." });
    res.json({ user: rows[0] });
  } catch (error) {
    next(error);
  }
});

app.get("/api/students", authenticate, requireRole("admin"), async (_req, res, next) => {
  try {
    const [students] = await pool.execute(
      `SELECT id, registration_number, fullname, sex, dob, address, parent_phone,
              trade, level, email, created_at FROM students ORDER BY created_at DESC`
    );
    res.json({ students });
  } catch (error) {
    next(error);
  }
});

app.delete("/api/students/:id", authenticate, requireRole("admin"), async (req, res, next) => {
  if (!/^\d+$/.test(req.params.id)) return res.status(400).json({ message: "Invalid student ID." });
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [students] = await connection.execute("SELECT user_id FROM students WHERE id = ?", [req.params.id]);
    if (!students[0]) {
      await connection.rollback();
      return res.status(404).json({ message: "Student not found." });
    }
    if (students[0].user_id) {
      await connection.execute("DELETE FROM users WHERE id = ?", [students[0].user_id]);
    } else {
      await connection.execute("DELETE FROM students WHERE id = ?", [req.params.id]);
    }
    await connection.commit();
    res.json({ message: "Student record deleted." });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
});

app.get("/api/marks/my", authenticate, async (req, res, next) => {
  try {
    const [marks] = req.user.role === "admin"
      ? await pool.execute(
        `SELECT m.id AS mark_id, s.registration_number, s.fullname, s.level,
                m.subject, m.term, m.score, m.max_score, m.grade
         FROM marks m JOIN students s ON s.id = m.student_id ORDER BY s.fullname, m.term, m.subject`
      )
      : await pool.execute(
        `SELECT m.id AS mark_id, s.registration_number, s.fullname, s.level,
                m.subject, m.term, m.score, m.max_score, m.grade
         FROM marks m JOIN students s ON s.id = m.student_id
         WHERE s.user_id = ? ORDER BY m.term, m.subject`,
        [req.user.sub]
      );
    res.json({ marks });
  } catch (error) {
    next(error);
  }
});

app.post("/api/marks/upload", authenticate, requireRole("admin"), marksUpload.single("file"), async (req, res, next) => {
  if (!req.file) return res.status(400).json({ message: "Choose an .xlsx workbook." });
  try {
    const workbook = xlsx.read(req.file.buffer, { type: "buffer", cellDates: false });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    if (!sheet) return res.status(400).json({ message: "The workbook does not contain a worksheet." });
    const rows = xlsx.utils.sheet_to_json(sheet, { defval: "", raw: false });
    const aliases = {
      registration_number: ["registrationnumber", "registrationno", "regnumber", "regno"],
      level: ["level"], subject: ["subject"], term: ["term"],
      score: ["score", "mark", "marks"], max_score: ["maxscore", "maximumscore", "outof"], grade: ["grade"]
    };
    const normalize = value => String(value).toLowerCase().replace(/[^a-z0-9]/g, "");
    const records = [];
    for (const row of rows) {
      const entries = Object.entries(row);
      const value = key => {
        const found = entries.find(([header]) => aliases[key].includes(normalize(header)));
        return found ? String(found[1]).trim() : "";
      };
      const record = {
        registration_number: value("registration_number"), level: value("level"),
        subject: value("subject"), term: value("term"),
        score: Number(value("score")), max_score: Number(value("max_score")), grade: value("grade") || null
      };
      if (!record.registration_number && !record.subject && !record.term) continue;
      if (!record.registration_number || !record.level || !record.subject || !record.term ||
          !Number.isFinite(record.score) || !Number.isFinite(record.max_score) ||
          record.score < 0 || record.max_score <= 0 || record.score > record.max_score) {
        return res.status(400).json({ message: `Invalid marks row ${records.length + 2}. Check the required columns and score values.` });
      }
      records.push(record);
    }
    if (!records.length) return res.status(400).json({ message: "No marks rows were found in the first worksheet." });

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      for (const record of records) {
        const [students] = await connection.execute(
          "SELECT id, level FROM students WHERE registration_number = ?", [record.registration_number]
        );
        if (!students[0] || students[0].level !== record.level) {
          throw Object.assign(new Error(`Student ${record.registration_number} was not found at level ${record.level}.`), { status: 400 });
        }
        await connection.execute(
          `INSERT INTO marks (student_id, subject, term, score, max_score, grade)
           VALUES (?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE score = VALUES(score), max_score = VALUES(max_score), grade = VALUES(grade)`,
          [students[0].id, record.subject, record.term, record.score, record.max_score, record.grade]
        );
      }
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      if (error.status === 400) return res.status(400).json({ message: error.message });
      throw error;
    } finally {
      connection.release();
    }
    res.json({ message: `${records.length} mark record(s) uploaded successfully.` });
  } catch (error) {
    next(error);
  }
});

app.get("/api/documents", async (_req, res, next) => {
  try {
    const [documents] = await pool.execute(
      `SELECT id, title, course, original_name, mime_type, created_at,
              CONCAT('/uploads/documents/', stored_name) AS url
       FROM documents ORDER BY created_at DESC`
    );
    res.json({ documents });
  } catch (error) {
    next(error);
  }
});

app.post("/api/documents", authenticate, requireRole("admin"), documentUpload.single("file"), async (req, res, next) => {
  const title = text(req.body?.title);
  const course = text(req.body?.course);
  if (!validText(title, 180) || !validText(course, 120) || !req.file) {
    if (req.file) fs.rmSync(req.file.path, { force: true });
    return res.status(400).json({ message: "Provide a title, course, and course document." });
  }
  try {
    await pool.execute(
      `INSERT INTO documents (title, course, original_name, stored_name, mime_type, created_by)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title, course, path.basename(req.file.originalname), path.basename(req.file.filename), req.file.mimetype, req.user.sub]
    );
    res.status(201).json({ message: "Document uploaded successfully." });
  } catch (error) {
    fs.rmSync(req.file.path, { force: true });
    next(error);
  }
});

app.get("/api/news", async (_req, res, next) => {
  try {
    const [news] = await pool.execute(
      `SELECT id, title, description, news_date AS date,
              CASE WHEN image_name IS NULL THEN NULL ELSE CONCAT('/uploads/news/', image_name) END AS image,
              created_at FROM news ORDER BY news_date DESC, id DESC`
    );
    res.json({ news });
  } catch (error) {
    next(error);
  }
});

app.post("/api/news", authenticate, requireRole("admin"), imageUpload.single("image"), async (req, res, next) => {
  const title = text(req.body?.title);
  const description = text(req.body?.description);
  const newsDate = text(req.body?.news_date) || new Date().toISOString().slice(0, 10);
  if (!validText(title, 180) || !validText(description, 10000) || !/^\d{4}-\d{2}-\d{2}$/.test(newsDate)) {
    if (req.file) fs.rmSync(req.file.path, { force: true });
    return res.status(400).json({ message: "Enter a title, description, and valid news date." });
  }
  try {
    await pool.execute(
      "INSERT INTO news (title, description, news_date, image_name, created_by) VALUES (?, ?, ?, ?, ?)",
      [title, description, newsDate, req.file?.filename || null, req.user.sub]
    );
    res.status(201).json({ message: "News posted successfully." });
  } catch (error) {
    if (req.file) fs.rmSync(req.file.path, { force: true });
    next(error);
  }
});

app.post("/api/comments", authenticate, requireRole("student"), async (req, res, next) => {
  const message = text(req.body?.message);
  if (!validText(message, 5000)) return res.status(400).json({ message: "Comment must contain 1 to 5,000 characters." });
  try {
    const [students] = await pool.execute("SELECT id FROM students WHERE user_id = ?", [req.user.sub]);
    if (!students[0]) return res.status(403).json({ message: "A student profile is required to send comments." });
    await pool.execute("INSERT INTO comments (student_id, message) VALUES (?, ?)", [students[0].id, message]);
    res.status(201).json({ message: "Comment sent successfully." });
  } catch (error) {
    next(error);
  }
});

app.get("/api/comments", authenticate, requireRole("admin"), async (_req, res, next) => {
  try {
    const [comments] = await pool.execute(
      `SELECT c.id AS commentid, s.fullname, s.registration_number, c.message, c.created_at
       FROM comments c JOIN students s ON s.id = c.student_id ORDER BY c.created_at DESC`
    );
    res.json({ comments });
  } catch (error) {
    next(error);
  }
});

app.use((error, _req, res, _next) => {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({
      message: error.code === "LIMIT_FILE_SIZE" ? "The selected file is too large." : "The uploaded file could not be accepted."
    });
  }
  if (error.message?.startsWith("Allowed file types:") || error.message === "Upload an .xlsx workbook.") {
    return res.status(400).json({ message: error.message });
  }
  if (error.message?.includes("not allowed to access")) return res.status(403).json({ message: error.message });
  console.error(error);
  res.status(500).json({ message: "The server could not complete the request." });
});

await initializeDatabase();
const server = app.listen(port, () => console.log(`Student registration API listening on port ${port}`));

async function shutdown() {
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
