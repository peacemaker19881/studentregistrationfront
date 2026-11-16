import "dotenv/config";
import mysql from "mysql2/promise";

const database = process.env.MYSQL_DATABASE;
if (!database || !/^[A-Za-z0-9_]+$/.test(database)) {
  throw new Error("Set MYSQL_DATABASE to a valid database name in backend/.env.");
}

const connection = await mysql.createConnection({
  host: process.env.MYSQL_HOST || "localhost",
  port: Number(process.env.MYSQL_PORT || 3306),
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD || ""
});
try {
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  console.log(`Database "${database}" is ready.`);
} finally {
  await connection.end();
}
