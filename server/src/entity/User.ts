import { Field, Int, ObjectType } from "type-graphql"
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm"

@Entity('user')
  @ObjectType()
export class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    @Field(() => Int)
    id: number

  @Field()
    @Column()
    name: string

    @Column()
    @Field()
    email: string

    @Column()
    password: string
}
