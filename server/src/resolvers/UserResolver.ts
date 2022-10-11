import { User } from "@entities";
import { Arg, Mutation, Query, Resolver } from "type-graphql";

@Resolver()
export default class UserResolver {
  @Mutation(() => User)
  async signup(
    @Arg("name") name: string,
    @Arg("email") email: string,
    @Arg("password") password: string,
  ) {
    //TODO: add validation

    return User.create({ name, email, password }).save();
  }

  @Query(() => String)
  dummy() {
    return 'hello world'
  }
}