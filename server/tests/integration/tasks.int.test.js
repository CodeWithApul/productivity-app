import request from "supertest";
import { beforeAll, expect, it, jest } from "@jest/globals";
import { app } from "../../app";
import env from "dotenv";
env.config();
const { TEST_TOKEN_EMAIL, TEST_TOKEN_PASSWORD } = process.env;

const endPoint = `/graphql`;
let authenticationToken = "";
let taskId = 0;

beforeAll(async () => {
  const {
    body: { token },
  } = await request(app).post("/login").send({
    email: TEST_TOKEN_EMAIL,
    password: TEST_TOKEN_PASSWORD,
  });
  authenticationToken = token;
});
describe(endPoint, () => {
  it("should test " + endPoint + " tasks for a user with no auth", async () => {
    const query = `query  {
    tasks{
        id
        title
        status
         }
    }`;
    const response = await request(app).post(endPoint).send({ query });
    expect(response.statusCode).toBe(401); // Unauthorized
    expect(response.body.errors[0].message).toBe("Missing authentication");
  });
  it(
    "should test " + endPoint + " tasks for a user with wrong auth",
    async () => {
      const {
        body: { token },
      } = await request(app)
        .post("/login")
        .send({
          email: TEST_TOKEN_EMAIL,
          password: TEST_TOKEN_PASSWORD + "wrong",
        });
      expect(token).toBeFalsy();
    }
  );
  it(
    "should test " + endPoint + " tasks for a user with correct auth",
    async () => {
      const query = `query  {
    tasks{
        id
        title
        status
         }  }`;

      expect(authenticationToken).toBeTruthy();
      const response = await request(app)
        .post(endPoint)
        .set({
          Authorization: "Bearer " + authenticationToken,
        })
        .send({ query });
      expect(response.statusCode).toBe(200);
      expect(response.body.data).toBeTruthy();
    }
  );
});

describe(endPoint + " Tasks resolver test", () => {
  it(
    "should test " + endPoint + " createTask for a user with no auth",
    async () => {
      const query = `mutation {
    createTask(input: { title: "Task 1", description: "Task 1 description", duedate: "2021-12-31", status: "pending" }) {
        id
        title
        status
        duedate } }`;
      const response = await request(app).post(endPoint).send({ query });
      expect(response.statusCode).toBe(401); // Unauthorized
      expect(response.body.errors[0].message).toBe("Missing authentication");
    }
  );
  it(
    "should test " + endPoint + " createTask for a user with correct auth",
    async () => {
      const query = `mutation { createTask(input: { title: "Task 1", description: "Task 1 description", duedate: "2021-12-31", status: "pending" }) {
        id
        title
        status
        duedate } }`;
      const response = await request(app)
        .post(endPoint)
        .set({
          Authorization: "Bearer " + authenticationToken,
        })
        .send({ query });
      expect(response.statusCode).toBe(200);
      expect(response.body.data).toBeTruthy();
      expect(response.body.data.createTask).toBeTruthy();
      expect(response.body.data.createTask.title).toBe("Task 1");
      taskId = response.body.data.createTask.id;
    }
  );
  it(
    "should test " + endPoint + " updateTask for a user with no auth",
    async () => {
      const query = `mutation {
    updateTask(input: { id: ${taskId}, title: "Task ${taskId}", description: "Task 1 description", duedate: "2021-12-31", status: "pending" }) {
        id
        title
        status
        duedate } }`;
      const response = await request(app).post(endPoint).send({ query });
      expect(response.statusCode).toBe(401); // Unauthorized
      expect(response.body.errors[0].message).toBe("Missing authentication");
    }
  );
  it(
    "should test " + endPoint + " updateTask for a user with correct auth",
    async () => {
      const query = `mutation {
    updateTask(input: { id: ${taskId}, title: "Task ${taskId}", description: "Task ${taskId} description", duedate: "2021-12-31", status: "pending" }) {
        id
        title
        status
        duedate } }`;
      const response = await request(app)
        .post(endPoint)
        .set({
          Authorization: "Bearer " + authenticationToken,
        })
        .send({ query });
      expect(response.statusCode).toBe(200);
      expect(response.body.data).toBeTruthy();
      expect(response.body.data.updateTask).toBeTruthy();
      expect(response.body.data.updateTask.title).toBe("Task " + taskId);
    }
  );
  it(
    "should test " + endPoint + " deleteTask for a user with no auth",
    async () => {
      const query = `mutation {
    deleteTask(id: ${taskId}) {
        id
        title
        status
        duedate } }`;
      const response = await request(app).post(endPoint).send({ query });
      expect(response.statusCode).toBe(401); // Unauthorized
      expect(response.body.errors[0].message).toBe("Missing authentication");
    }
  );
  it(
    "should test " + endPoint + " deleteTask for a user with correct auth",
    async () => {
      const query = `mutation {
    deleteTask(id: ${taskId}) {
        id
        title
        status
        duedate } }`;
      const response = await request(app)
        .post(endPoint)
        .set({
          Authorization: "Bearer " + authenticationToken,
        })
        .send({ query });
      expect(response.statusCode).toBe(200);
      expect(response.body.data).toBeTruthy();
      expect(response.body.data.deleteTask).toBeTruthy();
      expect(response.body.data.deleteTask.title).toBe("Task " + taskId);
    }
  );
});
