//import { AuthenticationError } from 'apollo-server-express';
import { MiddlewareFn } from 'type-graphql';
import { Task } from '@entities';
import { GlobalContextType } from '../GlobalContextType';

/**
 * Ensures that the user can change this task
 */
export const CheckAuthorized: MiddlewareFn<GlobalContextType> = async ({ context, args }, next) => {
  // Looks for the authenticated user
  const user = context.user;

  // Find the task that the user should be able to modify
  const task = await Task.findOne({ where: { userId: user!.id, id: args.id } })

  // If the task does not belong to the user we return an error
  if (!task) throw new Error("There is no task with such id for this user");

  // Ortherwise, we save the task into req to use it in the future
  context.req.task = task;


  return next();
}