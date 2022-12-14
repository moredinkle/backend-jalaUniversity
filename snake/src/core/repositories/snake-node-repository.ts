import SnakeNode from "../entities/snake-node";
import { Direction } from "../../types/types";

export interface ISnakeNodeRepository {
  //?
  create(snakeNode: SnakeNode): Promise<number>;
  read(id: number): Promise<SnakeNode | undefined>;
  readBySnakeId(snakeId: number): Promise<SnakeNode[] | undefined>;
  checkSnakeNodePosition(x: number, y: number, snakeId: number): Promise<SnakeNode>;
  update(snake: SnakeNode): Promise<void>;
  delete(id: number): Promise<number>;
}
