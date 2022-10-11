import { Resolver, Query, UseMiddleware, Ctx, Arg, Mutation, Int, Field, InputType } from "type-graphql";

import { Task } from "@entities";
import { CheckAuthenticated, CheckAuthorized, ValidateInputs } from "@middlewares";
import { UpdateTaskSchema, CreateTaskSchema } from './validationSchemas';
import { GlobalContextType } from "../../GlobalContextType";

// Input type for update tasks
@InputType()
class UpdateTaskInput {
  @Field(() => String, { nullable: true })
  title?: string;
  @Field(() => String, { nullable: true })
  description?: string;
  @Field(() => String, { nullable: true })
  status?: string;
}


@Resolver()
export default class TaskResolver {
  /**
   * Query for get all tasks that belongs for some user
   * @returns {Promise<Array<Task>>} - An array of Tasks
   */
  @UseMiddleware(CheckAuthenticated)
  @Query(() => [Task])
  getTasks(@Ctx() { user }: GlobalContextType) {
    return Task.find({ where: { userId: user!.id } })
  }

  /**
   * Mutation for create tasks, it will ensure the user is authenticated
   * @param {string} title - Title of the task
   * @param {string} description - Description of the task
   * @returns {Promise<Task>} - The created task
   */
  @UseMiddleware(CheckAuthenticated, ValidateInputs(CreateTaskSchema))
  @Mutation(() => Task)
  createTask(
    @Ctx()
    { user }: GlobalContextType,

    @Arg("title")
    title: string,

    @Arg("description")
    description: string
  ) {

    return Task.create({ description, title, userId: user!.id }).save()
  }

  /**
   * Mutation for updates tasks, it will ensure the user is authenticated
   * also checks that the task belongs to the user
   * @param {number} id - Id of the task to update
   * @param {UpdateTaskInput} newData - Title of the task
   * @param {string} newData.description - Description of the task
   * @param {string} newData.title - Title of the task
   * @param {string} newData.status - Status of the task
   * @returns {Promise<Task>} - The updated task
   */
  @UseMiddleware(CheckAuthenticated, CheckAuthorized, ValidateInputs(UpdateTaskSchema))
  @Mutation(() => Task)
  async updateTask(
    @Ctx() { req: { task } }: GlobalContextType,
    @Arg("id", () => Int) id: number,
    @Arg("newData", () => UpdateTaskInput) newData: UpdateTaskInput
  ): Promise<Task> {

    await Task.update({ id }, { ...task, ...newData }).then(response => response.raw[0])

    return { ...task, ...newData } as Task;
  }
}