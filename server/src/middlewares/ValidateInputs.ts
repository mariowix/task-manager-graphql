import yup from 'yup';
import { MiddlewareFn } from "type-graphql";
import { GlobalContextType } from "src/GlobalContextType";

/**
 * Ensures that the user is authenticated
 */
export const ValidateInputs = (schema: yup.AnyObjectSchema): MiddlewareFn<GlobalContextType> => {
  return async ({ args }, next) => {

    await schema.validate(args)

    return next();
  }
}