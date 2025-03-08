import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { readFile } from "node:fs/promises";
import { resolvers } from "./graphql/resolvers.js";
import env from "dotenv";

env.config();

const app = express();
const PORT = 4000;

app.use(express.urlencoded({ extended: true }), express.json());

const typeDefs = await readFile("./graphql/schema.graphql", "utf8");

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});
await apolloServer.start();

app.use("/graphql", expressMiddleware(apolloServer, {}));

app.listen(PORT, () => {
  console.log(`Application is running on http://localhost:${PORT}`);
  console.log(`GraphQL is running on http://localhost:${PORT}/graphql`);
});
