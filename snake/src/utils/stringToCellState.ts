import { CellState } from "../types/types";

export function stringToCellState(str: string): CellState | undefined {
  let res: CellState;
  if (str == "EMPTY") {
    res = "EMPTY";
    return res;
  }
  if (str == "FOOD") {
    res = "FOOD";
    return res;
  }
  if (str == "SNAKE") {
    res = "SNAKE";
    return res;
  }
  else {
    return undefined
  }
}
