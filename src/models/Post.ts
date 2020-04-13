import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { User } from "./User";

@Entity()
@ObjectType()
export class Post extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: string;

  @Field(() => String)
  @Column({ length: 5000 })
  body: string;

  @Field(() => String)
  @Column()
  title: string;

  @Field(() => User)
  @ManyToOne(type => User, user => user.posts)
  user: User;
}