import SnakeNode from "../core/entities/snake-node";
import { Direction } from "../types/types";

export default class SnakeMovementControl {
  leftBorderMovementControl(size: number, xPosition: number): number {
    const leftBorder = 0;
    if (xPosition == leftBorder) {
      return size - 1;
    } else {
      return xPosition - 1;
    }
  }

  rightBorderMovementControl(size: number, xPosition: number): number {
    if (xPosition == size - 1) {
      return 0;
    } else {
      return xPosition + 1;
    }
  }

  upBorderMovementControl(size: number, yPosition: number): number {
    if (yPosition == size - 1) {
      return 0;
    } else {
      return yPosition + 1;
    }
  }

  downBorderMovementControl(size: number, yPosition: number): number {
    const downBorder = 0;
    if (yPosition == downBorder) {
      return size - 1;
    } else {
      return yPosition - 1;
    }
  }
}
