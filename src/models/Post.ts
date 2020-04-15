import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { ObjectType, Field, ID, Int } from "type-graphql";
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

  @Column()
  userId: string;

  @Field(() => User)
  @ManyToOne(type => User, user => user.posts)
  @JoinColumn({ name: "userId" })
  user: User;
}