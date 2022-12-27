import { GameState } from "../../types/types";
import { stringToGameState } from "../../utils/stringToGameState";
import Position from "./position";
import Snake from "./snake";

export default class Game {
  id: string;
  snakes: Snake[];
  state: GameState;
  board: Position[];
  timer: number;
  boardSize: number;

  constructor(boardSize: number, status = "READY TO PLAY", timer = 1) {
    this.state = stringToGameState(status);
    this.timer = timer;
    this.boardSize = boardSize;
  }

  setBoard(board: Position[]) {
    this.board = board;
  }

  setSnakes(snakes: Snake[]) {
    this.snakes = snakes;
  }

  //set startPosition()
}
