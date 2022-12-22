import SnakeNode from "./snake-node";

export default class Snake {
  id: number;
  username: string;
  size: number;
  active: boolean;
  snakeNodes: SnakeNode[];
  score: number
  gameId: number;

  constructor(username: string, size = 1, active = true) {
    this.username = username;
    this.size = size;
    this.snakeNodes = [];
    this.active = active;
    this.score = 0;
    this.snakeNodes.push(new SnakeNode());
    this.gameId = -1;
  }
}
