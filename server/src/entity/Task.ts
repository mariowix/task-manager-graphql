import { Field, Int, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { TASK_STATUSES } from '../constants';

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