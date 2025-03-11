import {
  getTasks,
  getTasksById,
  getTasksByStatus,
  updateTask,
} from "../../model/tasks.js";
import { db } from "../../config/database.js";
import { describe, expect, it, jest } from "@jest/globals";
import { getUsers } from "../../model/users.js";

// Mock the database module
db.query = jest.fn();

describe("Tasks Model", () => {
  beforeEach(() => {
    // Clear mock calls before each test
    db.query.mockClear();
  });

  it("should return list of tasks for user", async () => {
    const user_id = 1;
    const mockTasks = [
      { id: 1, title: "Task 1", user_id: 1 },
      { id: 2, title: "Task 2", user_id: 1 },
    ];

    // Mock the query method to return the mock tasks
    db.query.mockResolvedValueOnce({ rows: mockTasks });

    const result = await getTasks(user_id);

    expect(db.query).toHaveBeenCalledWith(
      "SELECT * FROM tasks WHERE user_id=$1",
      [user_id]
    );
    expect(result).toEqual(mockTasks);
  });
  it("should return a task by id", async () => {
    const id = 1;
    const newTask = {
      id: 1,
      title: "Task 1",
      duedate: "Task 1 description",
    };
    db.query.mockResolvedValueOnce({ rows: [newTask] });

    const result = await getTasksById(id);

    expect(db.query).toBeCalledWith(`SELECT * FROM tasks WHERE id=$1`, [id]);
    expect(result).toEqual(newTask);
  });
  it("should return a task by status", async () => {
    const status = "pending";
    const user_id = 1;
    const newTask = {
      id: 1,
      title: "Task 1",
      duedate: "Task 1 description",
      status: "pending",
      user_id: 1,
    };
    db.query.mockResolvedValueOnce({ rows: [newTask] });

    const result = await getTasksByStatus(status, user_id);

    expect(db.query).toBeCalledWith(
      `SELECT * FROM tasks WHERE lower(status)=$1 AND user_id=$2`,
      [status.toLowerCase(), user_id]
    );
    expect(result).toEqual([newTask]);
  });
});

describe("User Model", () => {
  it("should return a list of users", async () => {
    const mockUsers = [
      { id: 1, email: "abc@email.com" },
      { id: 2, email: "ced@gmail.com" },
    ];
    db.query.mockResolvedValueOnce({ rows: mockUsers });
    const users = await getUsers();
    expect(users).toEqual(mockUsers);
    expect(db.query).toHaveBeenCalledWith("SELECT * from users");
  });
});

describe("Tasks Model", () => {
  it("should return list of tasks for user", async () => {
    const user_id = 1;
    const mockTasks = [
      { id: 1, title: "Task 1", user_id: 1 },
      { id: 2, title: "Task 2", user_id: 1 },
    ];

    // Mock the query method to return the mock tasks
    db.query.mockResolvedValueOnce({ rows: mockTasks });

    const result = await getTasks(user_id);

    expect(db.query).toHaveBeenCalledWith(
      "SELECT * FROM tasks WHERE user_id=$1",
      [user_id]
    );
    expect(result).toEqual(mockTasks);
  });

  it("should return error when nothing to update", async () => {
    const taskData = { id: 1, user_id: 1 };
    await expect(updateTask(taskData)).rejects.toThrow("No fields to update");
  });
});
