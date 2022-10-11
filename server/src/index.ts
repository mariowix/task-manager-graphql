
import * as dotenv from 'dotenv'
dotenv.config();
import 'module-alias/register';

import express from 'express';
import Fingerprint from 'express-fingerprint';
import { AppDataSource } from "./data-source"
import { ApolloServer } from 'apollo-server-express';
import { createSchema } from '../utils';

/* Wrap everything into a main function with async capabilities
   to use "await"
 */
const main = async () => {
  await AppDataSource.initialize()
  const app = express();
  // I added a fingerprint of the browser as part of the hashing for the JWT
  // by doing that, the JWT would work only if it was generated on the same
  // machine that it was generated (Fun)
  app.use(Fingerprint())
  const server = new ApolloServer({
    schema: await createSchema(),
    context: ({ res, req }) => ({ res: res, req: req }),
  });

  await server.start()


  app.listen(4000, () => {
    console.log('server linstening on port 4000');
  });

  server.applyMiddleware({ app });

}

main();
