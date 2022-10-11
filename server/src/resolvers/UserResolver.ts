import { User } from "@entities";
import { Arg, Field, InputType, Mutation, Query, Resolver } from "type-graphql";

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
  @Mutation(() => User)
  async signup(
    @Arg("newUser") { name, email, password }: SignupInput
  ) {
    //TODO: add validation

    return User.create({ name, email, password }).save();
  }

  @Query(() => String)
  dummy() {
    return 'hello world'
  }
}