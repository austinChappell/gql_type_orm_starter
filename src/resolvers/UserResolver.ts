import { Resolver, Query, Authorized, FieldResolver, Root } from "type-graphql";
import { User } from "../models/User";
import { Post } from "../models/Post";

@Resolver(User)
export class UserResolver {
  @Authorized()
  @Query(() => [User])
  users() {
    return User.find();
  }

  @FieldResolver()
  posts(@Root() user: User) {
    return Post.find({ where: { user } });
  }
}
