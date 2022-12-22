import { Direction } from "../types/types";

export function stringToDirection(str: string): Direction {
  let res: Direction;
  if (str == "UP") {
    res = "UP";
    return res;
  }
  if (str == "DOWN") {
    res = "DOWN";
    return res;
  }
  if (str == "RIGHT") {
    res = "RIGHT";
    return res;
  }
  if (str == "LEFT") {
    res = "LEFT";
    return res;
  }
}
