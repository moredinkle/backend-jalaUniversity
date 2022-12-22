import { GameState } from "../types/types";

export function stringToGameState(str: string): GameState {
  let res: GameState;
  if (str == "READY TO PLAY") {
    res = "READY TO PLAY";
    return res;
  }
  if (str == "PLAYING") {
    res = "PLAYING";
    return res;
  }
  if (str == "ENDED") {
    res = "ENDED";
    return res;
  }
}
