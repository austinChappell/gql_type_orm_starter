import { Resolver, Query, Authorized } from "type-graphql";
import { User } from "../models/User";

@Resolver()
export class UserResolver {
  @Authorized()
  @Query(() => [User])
  users() {
    return User.find();
  }
}
