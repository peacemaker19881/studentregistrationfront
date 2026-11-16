import "dotenv/config";
import bcrypt from "bcryptjs";
import { pool } from "../src/db.js";

const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;
if (!email || !password || password.length < 12) {
  throw new Error("Set ADMIN_EMAIL and an ADMIN_PASSWORD of at least 12 characters in backend/.env.");
}

try {
  const [existing] = await pool.execute("SELECT id, role FROM users WHERE email = ?", [email]);
  if (existing[0]) throw new Error("That email already belongs to an account.");
  const [result] = await pool.execute(
    "INSERT INTO users (email, password_hash, role) VALUES (?, ?, 'admin')",
    [email, await bcrypt.hash(password, 12)]
  );
  console.log(`Admin account ${email} created (user ${result.insertId}).`);
} finally {
  await pool.end();
}
