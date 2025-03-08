import { db } from "../config/database.js";

export async function getUsers() {
  const result = await db.query("SELECT * from users");
  return result.rows;
}

export async function getUserById(id) {
  const result = await db.query(`SELECT * FROM users WHERE id=$1`, [id]);
  return result.rows[0];
}

export async function getUserByEmail(email) {
  const result = await db.query(`SELECT * FROM users WHERE email=$1`, [email]);
  return result.rows[0];
}
