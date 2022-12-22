import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { GameState } from "../../../../types/types";

@Entity("Game")
export default class GameEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  state: GameState;

  @Column()
  timer: number;

  @Column()
  boardSize: number;

}
