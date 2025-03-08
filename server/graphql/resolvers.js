import { GraphQLError } from "graphql";
import {
  createTask,
  deleteTask,
  getTasks,
  getTasksById,
  getTasksByStatus,
  updateTask,
} from "../model/tasks.js";

export const resolvers = {
  Query: {
    tasks: async () => {
      const rows = await getTasks();

      if (!rows.length)
        throw new GraphQLError("NOT FOUND", {
          extensions: { code: "TASK_LIST_NOT_FOUND" },
        });
      return rows;
    },
    task: async (_root, { id }) => {
      const row = await getTasksById(id);
      if (!row)
        throw new GraphQLError("NOT FOUND", {
          extensions: { code: "TASK_NOT_FOUND" },
        });

      return row;
    },
    taskByStatus: async (_root, { status }) => {
      const rows = await getTasksByStatus(status);

      if (!rows.length)
        throw new GraphQLError("NOT FOUND", {
          extensions: { code: "TASK_LIST_NOT_FOUND" },
        });
      return rows;
    },
  },

  Mutation: {
    createTask: async (
      _root,
      { input: { title, description, duedate, status } }
    ) => {
      return createTask({ title, description, duedate, status });
    },
    updateTask: async (
      _root,
      { input: { id, title, description, duedate, status } }
    ) => {
      return await updateTask({ id, title, description, duedate, status });
    },
    deleteTask: async (_root, { id }) => {
      return await deleteTask(id);
    },
  },

  Task: {
    duedate: (task) => {
      return toIsoDate(task.duedate);
    },
  },
};

function toIsoDate(timestamp) {
  const dt = new Date(timestamp);
  return `${dt.getFullYear()}-${(dt.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${dt.getDate()}`;
}
