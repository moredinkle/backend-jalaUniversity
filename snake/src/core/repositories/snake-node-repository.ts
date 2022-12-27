import SnakeNode from "../entities/snake-node";
import { Direction } from "../../types/types";

export interface ISnakeNodeRepository {
  //?
  create(snakeNode: SnakeNode): Promise<string>;
  read(id: string): Promise<SnakeNode | undefined>;
  readBySnakeId(snakeId: string): Promise<SnakeNode[] | undefined>;
  checkSnakeNodePosition(x: number, y: number, snakeId: string): Promise<SnakeNode>;
  update(snake: SnakeNode): Promise<void>;
  delete(id: string): Promise<number>;
}
