import { TaskApiHelper } from './TaskApiHelper';
import { createConnection } from './data-source';
import { describe, beforeAll, it, expect, beforeEach, afterAll } from '@jest/globals';
import { DataSource } from 'typeorm';

let taskAPI: TaskApiHelper;
let accessToken: string;
let conn: DataSource;

const name = "Mario Mix"
const email = "mariomix@gmail.com";
const password = "strongPass4.!"

const secondEmail = "mariomix2@gmail.com";

const taskTitle = "Learn graphql";
const taskDescription = "Should learn graphql because lorem ipsum";

const newTitle = "Learn API REST";
const newDescription = "hacked";
const newStatus = "done";

describe("Task Resolver test", () => {
  beforeAll(async () => {
    taskAPI = new TaskApiHelper();
    conn = await createConnection(true).initialize();
    await taskAPI.createUser(name, email, password);
    await taskAPI.createUser(name, secondEmail, password);
    const { data: { login } }: any = await taskAPI.login(email, password);
    accessToken = login.accessToken;
  });

  afterAll(async () => {
    await conn.destroy();
  })

  beforeEach(() => {
    taskAPI.cleanToken();
  })

  describe("Task creation", () => {
    it("should throw an error if the user is not authenticated", async () => {
      const response = await taskAPI.createTask(taskTitle, taskDescription);

      expect(response).toBeTruthy();
      expect(response.data).toBeFalsy();
      expect(response.errors).toBeTruthy();

      expect(response.errors?.[0]?.message).toEqual("No token provided")
    });

    it("should create a task if the user is authenticated", async () => {
      taskAPI.setToken(accessToken);
      const response = await taskAPI.createTask(taskTitle, taskDescription);

      expect(response).toBeTruthy();
      expect(response.data).toBeTruthy();
      expect(response.errors).toBeFalsy();
    });
  });

  describe("Task update", () => {
    it("should throw an error if the user is not authenticated", async () => {

      const response = await taskAPI.updateTask(1, newTitle, taskDescription);

      expect(response).toBeTruthy();
      expect(response.data).toBeFalsy();
      expect(response.errors).toBeTruthy();

      expect(response.errors?.[0]?.message).toEqual("No token provided")
    });

    it("should throw an error if the user is not authorized to modify the task", async () => {
      taskAPI.setToken(accessToken);
      const { data: { createTask: { id } } }: any = await taskAPI.createTask(taskTitle, taskDescription);

      const { data: { login } }: any = await taskAPI.login(secondEmail, password);
      taskAPI.setToken(login.accessToken);

      const response = await taskAPI.updateTask(id, newTitle, newDescription, newStatus);

      expect(response).toBeTruthy();
      expect(response.data).toBeFalsy();
      expect(response.errors).toBeTruthy();

      expect(response.errors?.[0]?.message).toEqual("There is no task with such id for this user")
    });

    it("should update a task if the user is authorized", async () => {
      taskAPI.setToken(accessToken);
      const { data: { createTask: { id } } }: any = await taskAPI.createTask(taskTitle, taskDescription);
      const response = await taskAPI.updateTask(id, newTitle, newDescription, newStatus);

      expect(response).toBeTruthy();
      expect(response.data).toBeTruthy();
      expect(response.errors).toBeFalsy();
      expect(response.data!.updateTask.id).toEqual(id);
      expect(response.data!.updateTask.title).toEqual(newTitle);
      expect(response.data!.updateTask.description).toEqual(newDescription);
      expect(response.data!.updateTask.status).toEqual(newStatus);
    });
  });
});
