import pg from "pg";
import env from "dotenv";
env.config();

const { DB_HOST, DB_NAME, DB_PORT, DB_USER, DB_PASSWORD } = process.env;

const db = new pg.Client({
  host: DB_HOST,
  database: DB_NAME,
  user: DB_USER,
  password: DB_PASSWORD,
  port: DB_PORT,
});
await db.connect();

export { db };
