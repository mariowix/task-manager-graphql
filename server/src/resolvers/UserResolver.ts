import { User } from "@entities";
import { Arg, Field, InputType, Mutation, Query, Resolver } from "type-graphql";
import { hash, genSaltSync } from 'bcryptjs';

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
   *
   */
  @Mutation(() => User)
  async signup(
    @Arg("newUser") { name, email, password }: SignupInput
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

  @Query(() => String)
  dummy() {
    return 'hello world'
  }
}