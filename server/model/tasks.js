import { db } from "../config/database.js";

export async function getTasks() {
  const result = await db.query("SELECT * from tasks");
  return result.rows;
}

export async function getTasksById(id) {
  const result = await db.query(`SELECT * FROM tasks WHERE id=$1`, [id]);
  return result.rows[0];
}

export async function getTasksByStatus(status) {
  const result = await db.query(`SELECT * FROM tasks WHERE lower(status)=$1`, [
    status.toLowerCase(),
  ]);
  return result.rows;
}

export async function createTask({ title, description, duedate, status }) {
  const result = await db.query(
    `INSERT INTO tasks (title, description, dueDate, status) VALUES($1, $2, $3, $4) RETURNING *`,
    [title, description, duedate, status]
  );
  return result.rows[0];
}

export async function updateTask({ id, title, description, duedate, status }) {
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
    fields.push("dueDate=$" + (fields.length + 1));
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
    fields.join(", ") + " WHERE id=$" + (fields.length + 1) + " RETURNING *";
  values.push(id);

  const result = await db.query(query, values);
  return result.rows[0];
}

export async function deleteTask(id) {
  const result = await db.query(`DELETE FROM tasks WHERE id=$1 RETURNING *`, [
    id,
  ]);
  return result.rows[0];
}
