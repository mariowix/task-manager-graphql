import { TaskApiHelper } from './TaskApiHelper';
import { createConnection } from './data-source';
import { describe, beforeAll, it, expect, afterAll } from '@jest/globals';
import { DataSource } from 'typeorm';

let taskAPI: TaskApiHelper;
let conn: DataSource;
const name = "Mario Mix"
const email = "mariomix@gmail.com";
const password = "strongPass4.!"

describe("User Resolver test", () => {
  beforeAll(async () => {
    taskAPI = new TaskApiHelper();
    conn = await createConnection(true).initialize();
  });

  afterAll(async () => {
    await conn.destroy()
  })

  describe("Register", () => {
    it("should create user", async () => {
      const response = await taskAPI.createUser(name, email, password);

      expect(response).toBeTruthy();
      expect(response.data).toBeTruthy();

      expect(response.data?.signup).toBeTruthy();
      expect(response.errors).toBeFalsy();
    });

    it("should return an error if the user already exists", async () => {
      const response = await taskAPI.createUser(name, email, password);

      expect(response).toBeTruthy();
      expect(response.data).toBeFalsy();
      expect(response.errors).toBeTruthy();

      expect(response.errors?.[0]?.message).toEqual("Email is already registered")
    });
  });

  describe("Login", () => {
    it("should login successfully", async () => {
      const response = await taskAPI.login(email, password);

      expect(response).toBeTruthy();
      expect(response.data).toBeTruthy();
      expect(response.errors).toBeFalsy();
    });

    it("should return an error if the user or password is incorrect", async () => {
      const response = await taskAPI.login(email, 'wrong pass');

      expect(response).toBeTruthy();
      expect(response.data).toBeFalsy();
      expect(response.errors).toBeTruthy();
      expect(response.errors?.[0]?.message).toEqual("Email or password invalid")
    });
  });
});
