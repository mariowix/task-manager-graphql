import { graphql, GraphQLSchema } from 'graphql';
import { createSchema } from '../utils';

interface Options {
  source: string,
  variableValues?: any
}

export class TaskApiHelper {
  private schema: GraphQLSchema;
  private req: any = {};
  private res: any = {};

  private async _gCall({ source, variableValues }: Options) {
    if (!this.schema) {
      this.schema = await createSchema();
    }

    return graphql({
      schema: this.schema,
      source,
      variableValues,
      contextValue: { req: this.req, res: this.res }
    })
  }

  private registerMutation = `
  mutation($newUser: SignupInput!) {
    signup(newUser: $newUser) {
      email
      id
      name
    }
  }`;
  createUser(name: string, email: string, password: string) {
    return this._gCall({
      source: this.registerMutation,
      variableValues: {
        newUser: {
          name,
          email,
          password
        }
      }
    })
  }

}