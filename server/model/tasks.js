import { db } from "../config/database.js";

export async function getTasks(user_id) {
  const result = await db.query("SELECT * FROM tasks WHERE user_id=$1", [
    user_id,
  ]);
  return result.rows;
}

export async function getTasksById(id) {
  const result = await db.query(`SELECT * FROM tasks WHERE id=$1`, [id]);
  return result.rows[0];
}

export async function getTasksByStatus(status, user_id) {
  const result = await db.query(
    `SELECT * FROM tasks WHERE lower(status)=$1 AND user_id=$2`,
    [status.toLowerCase(), user_id]
  );
  return result.rows;
}

export async function createTask({
  title,
  description,
  duedate,
  status,
  user_id,
}) {
  const result = await db.query(
    `INSERT INTO tasks (title, description, dueDate, status, user_id) VALUES($1, $2, $3, $4, $5) RETURNING *`,
    [title, description, duedate, status, user_id]
  );
  return result.rows[0];
}

export async function updateTask({
  id,
  title,
  description,
  duedate,
  status,
  user_id,
}) {
  const fields = [];
  const values = [];
  let query = "UPDATE tasks SET ";

  if (title !== undefined) {
    fields.push("title=$" + (fields.length + 1));
    values.push(title);
  }
  if (description !== undefined) {
    fields.push("description=$" + (fields.length + 1));
    values.push(description);
  }
  if (duedate !== undefined) {
    fields.push("duedate=$" + (fields.length + 1));
    values.push(duedate);
  }
  if (status !== undefined) {
    fields.push("status=$" + (fields.length + 1));
    values.push(status);
  }

  if (fields.length === 0) {
    throw new Error("No fields to update");
  }

  query +=
    fields.join(", ") +
    " WHERE id=$" +
    (fields.length + 1) +
    " AND user_id=$" +
    (fields.length + 2) +
    " RETURNING *";
  values.push(id);
  values.push(user_id);

  const result = await db.query(query, values);
  return result.rows[0];
}

export async function deleteTask(id, user_id) {
  const result = await db.query(
    `DELETE FROM tasks WHERE id=$1 AND user_id=$2 RETURNING *`,
    [id, user_id]
  );
  return result.rows[0];
}
