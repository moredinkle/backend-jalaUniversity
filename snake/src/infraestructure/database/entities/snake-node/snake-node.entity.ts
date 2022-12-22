import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Direction } from "../../../../types/types";
import SnakeEntity from "../snake/snake.entity";

@Entity("SnakeNode")
export default class SnakeNodeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  x: number;

  @Column()
  y: number;

  @Column()
  direction: Direction;

  @Column()
  snakeId: number;
}
