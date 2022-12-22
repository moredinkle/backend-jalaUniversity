import { CellState } from "../../types/types";

export default class Position {
  id: number;
  x: number;
  y: number;
  occupier: CellState;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.occupier = "EMPTY";
  }

  //setState
  //ocupante ?
}
