import { Column, Entity, PrimaryColumn } from "typeorm"

@Entity('User')
export default class UserEntity{
    @PrimaryColumn()
    id!: number

    @Column()
    name!: string

    @Column()
    lastname!: string
}