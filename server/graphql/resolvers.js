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
    tasks: async (_root, _args, { user }) => {
      if (!user) {
        throw unauthorizedError("Missing authentication");
      }
      const rows = await getTasks(user.id);

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
    taskByStatus: async (_root, { status }, { user }) => {
      if (!user) {
        throw unauthorizedError("Missing authentication");
      }
      const rows = await getTasksByStatus(status, user.id);

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
      { input: { title, description, duedate, status } },
      { user }
    ) => {
      if (!user) {
        throw unauthorizedError("Missing authentication");
      }
      return createTask({ title, description, duedate, status, user_id });
    },
    updateTask: async (
      _root,
      { input: { id, title, description, duedate, status } },
      { user }
    ) => {
      if (!user) {
        throw unauthorizedError("Missing authentication");
      }
      return await updateTask({
        id,
        title,
        description,
        duedate,
        status,
        user_id,
      });
    },
    deleteTask: async (_root, { id }, { user }) => {
      if (!user) {
        throw unauthorizedError("Missing authentication");
      }
      return await deleteTask(id, user_id);
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

function unauthorizedError(message) {
  return new GraphQLError(message, {
    extensions: {
      code: "UNAUTHORIZED",
    },
  });
}
