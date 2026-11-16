import mysql from "mysql2/promise";

for (const key of ["MYSQL_HOST", "MYSQL_USER", "MYSQL_DATABASE"]) {
  if (!process.env[key]) throw new Error(`${key} must be set in backend/.env.`);
}

export const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT || 3306),
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD || "",
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  charset: "utf8mb4"
});

export async function initializeDatabase() {
  const statements = [
    `CREATE TABLE IF NOT EXISTS users (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(254) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      role ENUM('student', 'admin') NOT NULL DEFAULT 'student',
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB`,
    `CREATE TABLE IF NOT EXISTS students (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      user_id INT UNSIGNED NULL UNIQUE,
      registration_number VARCHAR(32) NOT NULL UNIQUE,
      fullname VARCHAR(160) NOT NULL,
      sex VARCHAR(24) NOT NULL,
      dob DATE NOT NULL,
      address VARCHAR(255) NOT NULL,
      parent_phone VARCHAR(32) NOT NULL,
      trade VARCHAR(120) NOT NULL,
      level VARCHAR(32) NOT NULL,
      email VARCHAR(254) NOT NULL UNIQUE,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_students_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    ) ENGINE=InnoDB`,
    `CREATE TABLE IF NOT EXISTS marks (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      student_id INT UNSIGNED NOT NULL,
      subject VARCHAR(120) NOT NULL,
      term VARCHAR(80) NOT NULL,
      score DECIMAL(7,2) NOT NULL,
      max_score DECIMAL(7,2) NOT NULL,
      grade VARCHAR(16) NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY uq_mark (student_id, subject, term),
      CONSTRAINT fk_marks_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
    ) ENGINE=InnoDB`,
    `CREATE TABLE IF NOT EXISTS documents (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(180) NOT NULL,
      course VARCHAR(120) NOT NULL,
      original_name VARCHAR(255) NOT NULL,
      stored_name VARCHAR(80) NOT NULL UNIQUE,
      mime_type VARCHAR(120) NOT NULL,
      created_by INT UNSIGNED NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_documents_user FOREIGN KEY (created_by) REFERENCES users(id)
    ) ENGINE=InnoDB`,
    `CREATE TABLE IF NOT EXISTS news (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(180) NOT NULL,
      description TEXT NOT NULL,
      news_date DATE NOT NULL,
      image_name VARCHAR(80) NULL,
      created_by INT UNSIGNED NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_news_user FOREIGN KEY (created_by) REFERENCES users(id)
    ) ENGINE=InnoDB`,
    `CREATE TABLE IF NOT EXISTS comments (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      student_id INT UNSIGNED NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_comments_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
    ) ENGINE=InnoDB`
  ];
  for (const statement of statements) await pool.query(statement);
}
