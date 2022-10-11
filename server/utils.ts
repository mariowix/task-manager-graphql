import { buildSchema } from "type-graphql"
import { UserResolver } from "./src/resolvers";

export const createSchema = () => {
  return buildSchema({
    resolvers: [UserResolver]
  })
}