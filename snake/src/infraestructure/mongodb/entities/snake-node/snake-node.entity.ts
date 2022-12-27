import { Entity, ObjectID, ObjectIdColumn, Column } from "typeorm"
import { Direction } from "../../../../types/types";


@Entity("SnakeNode")
export default class SnakeNodeEntity {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  x: number;

  @Column()
  y: number;

  @Column()
  direction: Direction;

  @Column()
  snakeId: string;
}
