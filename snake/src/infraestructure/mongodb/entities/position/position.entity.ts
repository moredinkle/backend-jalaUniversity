import { Entity, ObjectID, ObjectIdColumn, Column } from "typeorm"

import { CellState } from "../../../../types/types";

@Entity("Position")
export default class PositionEntity {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  x: number;

  @Column()
  y: number;

  @Column()
  occupier: CellState;

}
