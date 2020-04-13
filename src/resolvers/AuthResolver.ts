import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { Resolver, Mutation, Arg, Ctx } from "type-graphql";
import { User } from "../models/User";
import { SignUpInput } from "../inputs/SignUpInput";
import { SignInInput } from "../inputs/SignInInput";
import { Context } from "../types/context";

// Local Variables
const setToken = (ctx: Context, user: User) => {
  const tokenLifeInMinutes = 30;

  const token = jwt.sign(
    {
      user: {
        email: user.email,
        id: user.id,
      }
    },
    process.env.TOKEN_SECRET || '',
    { expiresIn: `${tokenLifeInMinutes}m` }
  );

  ctx.res.cookie(
    'token',
    token,
    {
      httpOnly: true,
      maxAge: 1000 * 60 * tokenLifeInMinutes,
    }
  );
}

function checkPassword(password: string, passwordHash: string) {
  return bcrypt.compareSync(password, passwordHash);
}

function hashPassword(password: string) {
  const salt = bcrypt.genSaltSync(10);
  return password
    ? bcrypt.hashSync(password, salt)
    : null;
}

@Resolver()
export class AuthResolver {
  @Mutation(() => User)
  async signUp(
    @Arg('data') data: SignUpInput,
    @Ctx() ctx: Context
  ) {
    const trimmedEmail = data.email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: trimmedEmail,
    });

    if (existingUser) {
      throw new Error('User with this email already exists.');
    }

    const hashedPassword = hashPassword(data.password);

    if (!hashedPassword) {
      throw new Error('Unable to save password.');
    }

    const user = await User.create({
      email: trimmedEmail,
      firstName: data.firstName,
      lastName: data.lastName,
      password: hashedPassword,
    }).save();

    setToken(ctx, user);

    return user;
  }

  @Mutation(() => User)
  async signIn(
    @Arg('data') data: SignInInput,
    @Ctx() ctx: Context
  ) {
    const errorMessage = 'Invalid credentials';

    const trimmedEmail = data.email.trim().toLowerCase();

    const user = await User.findOne({
      email: trimmedEmail,
    })

    if (!user) {
      throw new Error(errorMessage);
    }

    const isPasswordValid = checkPassword(data.password, user.password);

    if (!isPasswordValid) {
      throw new Error(errorMessage)
    }

    setToken(ctx, user);

    return user;
  }

  @Mutation(() => Boolean)
  async signOut(@Ctx() ctx: Context) {
    ctx.res.clearCookie('token');

    return true;
  }
}
