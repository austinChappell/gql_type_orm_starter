import { InputType, Field } from "type-graphql";

@InputType()
export class CreatePostInput {
  @Field(() => String)
  body: string;

  @Field(() => String)
  title: string;
}
