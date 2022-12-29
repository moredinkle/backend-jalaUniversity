import { Entity, ObjectID, ObjectIdColumn, Column, PrimaryGeneratedColumn } from "typeorm"
import { ObjectId } from 'mongodb';

@Entity("Snake")
export default class SnakeEntity {
  @ObjectIdColumn()
  _id: ObjectId;

  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  username: string;

  @Column()
  size: number;

  @Column()
  active: boolean;
  
  @Column()
  score: number;

  @Column()
  gameId: string;

}
