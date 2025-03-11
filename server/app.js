import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { readFile } from "node:fs/promises";

import { resolvers } from "./graphql/resolvers.js";
import { getUserById } from "./model/users.js";
import { authMiddleware, handleLogin } from "./model/auth.js";

const app = express();

app.use(express.urlencoded({ extended: true }), express.json(), authMiddleware);

app.post("/login", handleLogin);

const typeDefs = await readFile("./graphql/schema.graphql", "utf8");

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});
await apolloServer.start();

export async function getContext({ req }) {
  if (req.auth) {
    const user = await getUserById(req.auth.sub);
    // console.log(user);
    return { user };
  }
  return {};
}

app.use("/graphql", expressMiddleware(apolloServer, { context: getContext }));

export { app };
