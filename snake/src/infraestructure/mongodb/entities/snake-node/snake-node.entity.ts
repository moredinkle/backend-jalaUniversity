import { Entity, ObjectID, ObjectIdColumn, Column, PrimaryGeneratedColumn } from "typeorm"
import { ObjectId } from 'mongodb';
import { Direction } from "../../../../types/types";


@Entity("SnakeNode")
export default class SnakeNodeEntity {
  @ObjectIdColumn()
  _id: ObjectId;

  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  x: number;

  @Column()
  y: number;

  @Column()
  direction: Direction;

  @Column()
  snakeId: string;
}
