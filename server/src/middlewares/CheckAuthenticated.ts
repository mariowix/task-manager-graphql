import { AuthenticationError } from "apollo-server-express";
import { verify } from "jsonwebtoken";
import { User } from "@entities";
import { GlobalContextType } from "src/GlobalContextType";
import { MiddlewareFn } from "type-graphql";

/**
 * Ensures that the user is authenticated
 */
export const CheckAuthenticated: MiddlewareFn<GlobalContextType> = async ({ context }, next) => {
  // Get the token from the headers
  const token = context.req.headers?.authorization?.split(' ')[1];

  // Return an error if no token is provided
  if (!token) throw new AuthenticationError('No token provided');

  // Get the payload form the JWT
  const payload: any = verify(token, process.env.ACCESS_TOKEN_SECRET! + context.req.fingerprint.hash);

  // Get the user info
  const user = await User.findOne({ where: { id: payload.userId } })

  if (!user)
    throw new AuthenticationError('Not authenticated user');

  // Save the user into the context
  context.user = user;

  return next();
}