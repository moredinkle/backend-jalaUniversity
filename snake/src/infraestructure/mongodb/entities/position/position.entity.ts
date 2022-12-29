import { Entity, ObjectID, ObjectIdColumn, Column, PrimaryGeneratedColumn } from "typeorm"
import { ObjectId } from 'mongodb';
import { CellState } from "../../../../types/types";

@Entity("Position")
export default class PositionEntity {
  @ObjectIdColumn()
  _id: ObjectId;

  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  x: number;

  @Column()
  y: number;

  @Column()
  occupier: CellState;

}
