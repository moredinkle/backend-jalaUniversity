import Snake from "../../../../core/entities/snake";
import SnakeEntity from "./snake.entity";
import { SnakeNodeMapper } from "../snake-node/snake-node-mapper";

export class SnakeMapper {
  static toDomain(raw: SnakeEntity): Snake {
    const snake = new Snake(raw.username);
    snake.id = raw.id;
    snake.size = raw.size;
    snake.active = raw.active;
    snake.score = raw.score;
    snake.gameId = raw.gameId;
    return snake;
  }
}
