import { Direction } from "../../types/types";

export default class SnakeNode {
  id: number;
  x: number;
  y: number;
  direction: Direction;
  snakeId: number;

  constructor(x = 0, y = 0) {
    this.direction = "RIGHT";
    this.x = x;
    this.y = y;
  }
}
