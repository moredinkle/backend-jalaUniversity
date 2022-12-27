import { Direction } from "../../types/types";

export default class SnakeNode {
  id: string;
  x: number;
  y: number;
  direction: Direction;
  snakeId: string;

  constructor(x = 0, y = 0) {
    this.direction = "RIGHT";
    this.x = x;
    this.y = y;
  }
}
