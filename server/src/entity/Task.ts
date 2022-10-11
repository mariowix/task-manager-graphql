import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

enum TASK_STATUSES {
  TO_DO = "todo",
  IN_PROGRESS = "in-progress",
  DONE = "done",
  ARCHIVED = "archived"
}


@Entity('task')
export class Task extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @Column()
  description: string

  @Column('int')
  userId: number

  @Column({
    enum: TASK_STATUSES,
    default: TASK_STATUSES.TO_DO
  })
  status: string
}