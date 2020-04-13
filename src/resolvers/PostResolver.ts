import { Resolver, Authorized, Query, Mutation, Arg, Ctx, FieldResolver, Root } from "type-graphql";
import { Post } from "../models/Post";
import { CreatePostInput } from "../inputs/CreatePostInput";
import { User } from "../models/User";
import { Context } from "../types/context";
import { UpdatePostInput } from "../inputs/UpdatePostInput";

async function verifyOwnership(ctx: Context, postId: string) {
  const user = await User.findOne({ id: ctx.req.userId });

  const post = await Post.findOne({
    id: postId,
    user,
  });

  if (!post) {
    throw new Error('Post not found.');
  }
}

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

  @Authorized()
  @Mutation(() => Post)
  async updatePost(
    @Arg('id') id: string,
    @Arg('data') data: UpdatePostInput,
    @Ctx() ctx: Context
  ) {
    await verifyOwnership(ctx, id);

    await Post.update({ id }, data);

    return Post.findOne({ id });
  }

  @Authorized()
  @Mutation(() => Boolean)
  async deletePost(
    @Arg('id') id: string,
    @Ctx() ctx: Context
  ) {
    await verifyOwnership(ctx, id);

    await Post.delete({ id });

    return true;
  }

  @FieldResolver()
  user(@Root() post: Post) {
    return User.findOne(post.user);
  }
}
