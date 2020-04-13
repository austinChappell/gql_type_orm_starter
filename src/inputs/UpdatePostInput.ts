import { InputType, Field } from "type-graphql";

@InputType()
export class UpdatePostInput {
  @Field(() => String, { nullable: true })
  body?: string;

  @Field(() => String, { nullable: true })
  title?: string;
}
