import { Entity, ObjectID, ObjectIdColumn, Column } from "typeorm"
import { GameState } from "../../../../types/types";

@Entity("Game")
export default class GameEntity {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  state: GameState;

  @Column()
  timer: number;

  @Column()
  boardSize: number;

}