import Snake from "../../../../core/entities/snake";
import SnakeEntity from "./snake.entity";
import { SnakeNodeMapper } from "../snake-node/snake-node-mapper";
import { ObjectID } from "typeorm";

export class SnakeMapper {
  static toDomain(raw: SnakeEntity): Snake {
    const snake = new Snake(raw.username);
    snake.id = raw.id.toString();
    snake.size = raw.size;
    snake.active = raw.active;
    snake.score = raw.score;
    snake.gameId = raw.gameId;
    return snake;
  }

  static toEntity(raw: Snake): SnakeEntity {
    const snake = new SnakeEntity();
    snake.id = new ObjectID(raw.id);
    snake.username = raw.username;
    snake.size = raw.size;
    snake.active = raw.active;
    snake.score = raw.score;
    snake.gameId = raw.gameId;
    return snake;
  }
}
