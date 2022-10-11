import * as dotenv from 'dotenv'
dotenv.config();

import express from 'express';
import { AppDataSource } from "./data-source"
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import UserResolver from './resolvers/UserResolver';

const main = async () => {
  await AppDataSource.initialize()
  const app = express();

  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver]
    })
  });

  await server.start()


  app.listen(4000, () => {
    console.log('server linstening on port 4000');
  });

  server.applyMiddleware({ app });

}

main();

