import { Resolver, Authorized, Query, Mutation, Arg, Ctx, FieldResolver, Root } from "type-graphql";
import { Post } from "../models/Post";
import { CreatePostInput } from "../inputs/CreatePostInput";
import { User } from "../models/User";
import { Context } from "../types/context";

@Resolver(Post)
export class PostResolver {
  @Authorized()
  @Query(() => [Post])
  posts() {
    return Post.find();
  }

  @Authorized()
  @Mutation(() => Post)
  async createPost(
    @Arg('data') data: CreatePostInput,
    @Ctx() ctx: Context
  ) {
    const user = await User.findOne({
      id: ctx.req.userId,
    });

    return Post.create({
      ...data,
      user,
    }).save();
  }

  @FieldResolver()
  user(@Root() post: Post) {
    return User.findOne(post.user);
  }
}
