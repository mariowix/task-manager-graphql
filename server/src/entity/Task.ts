import { Field, Int, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

enum TASK_STATUSES {
  TO_DO = "todo",
  IN_PROGRESS = "in-progress",
  DONE = "done",
  ARCHIVED = "archived"
}

@Entity('task')
  @ObjectType()
export class Task extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number

  @Column()
  @Field()
  title: string

  @Column()
  @Field()
  description: string

  @Column('int')
  userId: number

  @Column({
    enum: TASK_STATUSES,
    default: TASK_STATUSES.TO_DO
  })
  @Field()
  status: string
}