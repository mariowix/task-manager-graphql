import { graphql, GraphQLSchema } from 'graphql';
import { createSchema } from '../utils';

interface Options {
  source: string,
  variableValues?: any
}

export class TaskApiHelper {
  private schema: GraphQLSchema;
  private req: any = {
    fingerprint: {
      hash: 'dummy'
    }
  };
  private res: any = {
    cookie: () => { }
  };

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

  private loginMutation = `
  mutation($password: String!, $email: String!) {
    login(password: $password, email: $email) {
      accessToken
    }
  }`

  login(email: string, password: string) {
    return this._gCall({
      source: this.loginMutation,
      variableValues: {
        email,
        password
      }
    })
  }

  cleanToken() {
    this.req = {
      fingerprint: {
        hash: "dummy"
      }
    }
  }

  setToken(token: string) {
    this.req.headers = { authorization: `Bearer ${token}` }
  }
  private createTaskMutation = `
  mutation($description: String!, $title: String!) {
    createTask(description: $description, title: $title) {
      title,
      description,
      id,
      status
    }
  }`;

  createTask(title: string, description: string) {
    return this._gCall({
      source: this.createTaskMutation,
      variableValues: {
        title,
        description
      }
    })
  }

  private updateTaskMutation = `
  mutation($updateTaskId: Int!, $newData: UpdateTaskInput!) {
    updateTask(id: $updateTaskId, newData: $newData) {
      id,
      title,
      description,
      status
    }
  }`;

  updateTask(updateTaskId: number, title?: string, description?: string, status?: string) {
    return this._gCall({
      source: this.updateTaskMutation,
      variableValues: {
        updateTaskId,
        newData: {
          title,
          description,
          status
        }
      }
    })
  }
}