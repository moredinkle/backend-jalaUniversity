import { Entity, ObjectIdColumn, Column, PrimaryGeneratedColumn } from "typeorm"
import { ObjectId } from 'mongodb';
import { GameState } from "../../../../types/types";

@Entity("Game")
export default class GameEntity {
  @ObjectIdColumn()
  _id: ObjectId;

  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  state: GameState;

  @Column()
  timer: number;

  @Column()
  boardSize: number;

}