import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver, UseMiddleware } from "type-graphql";
import { hash, genSaltSync, compare } from 'bcryptjs';
import { AuthenticationError } from "apollo-server-express";
import { sign } from 'jsonwebtoken';

import { User } from "@entities";
import { GlobalContextType } from "../../GlobalContextType";
import { ValidateInputs } from "@middlewares";
import { LoginSchema, SignUpSchema } from './validationSchemas';

/**
 * Input type for signing up new users
 */
@InputType()
class SignupInput {
  @Field()
  name: string

  @Field()
  password: string

  @Field()
  email: string
}

// Response for the login mutation
@ObjectType()
export class LoginResponse {
  @Field()
  accessToken: string
}

@Resolver()
export default class UserResolver {
  /**
   * Mutation operation for create a new user
   *
   * @param {SignupInput} newUser - The new user info
   * @param {string} newUser.name - The new user name
   * @param {string} newUser.email - The new user email
   * @param {string} newUser.password - The new user password
   * @returns {Promise<User>} - The new user created
   */
  @UseMiddleware(ValidateInputs(SignUpSchema))
  @Mutation(() => User)
  async signup(
    @Arg("newUser")
    { name, email, password }: SignupInput
  ) {
    //TODO: add validation

    // Check if the user exitsts
    const user = await User.findOne({ where: { email } });

    // If the user exists, we return an error, can't register the same user twice
    if (user) throw Error("Email is already registered");

    // Hash the password to store the hash instead of the plain password
    const passwordHased = await hash(password, genSaltSync())

    // Return the newly created user
    return User.create({ name, email, password: passwordHased }).save();
  }

  /**
  * Mutation operation for login an user.
  * @param {string} email - The email of the user.
  * @param {string} password - The password of the user.
  * @returns {Promise<LoginResponse>} - The response containing an accessToken
  */
  @UseMiddleware(ValidateInputs(LoginSchema))
  @Mutation(() => LoginResponse)
  async login(
    @Arg("email")
    email: string,

    @Arg("password")
    password: string,

    @Ctx()
    { req: { fingerprint: { hash: fingerprint } }, res }: GlobalContextType
  ) {
    // Look for the user to see if it even exists
    const user = await User.findOne({ where: { email } });

    // If the user does not exists we return an error
    if (!user)
      throw new AuthenticationError("Email or password invalid");

    // Check if the password produces the same hash
    const isValidPass = await compare(password, user.password);

    // If not, we return an error
    if (!isValidPass)
      throw new AuthenticationError("Email or password invalid");

    // Generate accessToken
    const accessToken = sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET! + fingerprint, { expiresIn: '15m' })

    // Set a cookie to store the refresh token
    res.cookie(
      'tartk',
      sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET! + fingerprint, { expiresIn: '15m' }),
      {
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 60 * 24 * 7
      }
    );

    // Return the accessToken
    return {
      accessToken
    }
  }

  @Query(() => String)
  dummy() {
    return 'hello world'
  }
}