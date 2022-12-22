import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { CellState } from "../../../../types/types";

@Entity("Position")
export default class PositionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  x: number;

  @Column()
  y: number;

  @Column()
  occupier: CellState;

}
