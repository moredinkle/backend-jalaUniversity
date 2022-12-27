import SnakeNode from "./snake-node";

export default class Snake {
  id: string;
  username: string;
  size: number;
  active: boolean;
  snakeNodes: SnakeNode[];
  score: number
  gameId: string;

  constructor(username: string, size = 1, active = true) {
    this.username = username;
    this.size = size;
    this.snakeNodes = [];
    this.active = active;
    this.score = 0;
    this.snakeNodes.push(new SnakeNode());
    this.gameId = "";
  }
}
