import { InputType, Field } from "type-graphql";

@InputType()
export class SignInInput {
  @Field()
  email: string;

  @Field()
  password: string;
}
