import { buildSchema } from "type-graphql"
import { UserResolver, TaskResolver } from "./src/resolvers";

export const createSchema = () => {
  return buildSchema({
    resolvers: [UserResolver, TaskResolver]
  })
}