import "reflect-metadata"
import { DataSource } from "typeorm"
import { User, Task } from "../src/entity"

export const createConnection = (drop = false) => {
  return new DataSource({
    type: "sqlite",
    database: "database-test.sqlite",
    synchronize: true,
    dropSchema: drop,
    logging: false,
    entities: [User, Task],
    migrations: [],
    subscribers: [],
  });
}
