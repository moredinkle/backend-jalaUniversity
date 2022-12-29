import Snake from "../../../../core/entities/snake";
import SnakeEntity from "./snake.entity";
import { SnakeNodeMapper } from "../snake-node/snake-node-mapper";
import { ObjectId } from 'mongodb';

export class SnakeMapper {
  static toDomain(raw: SnakeEntity): Snake {
    const snake = new Snake(raw.username);
    snake.id = raw._id.toString();
    snake.size = raw.size;
    snake.active = raw.active;
    snake.score = raw.score;
    snake.gameId = raw.gameId;
    return snake;
  }

  static toEntity(raw: Snake): SnakeEntity {
    const snake = new SnakeEntity();
    if(raw.id) {
      snake._id = new ObjectId(raw.id);
    }
    snake.username = raw.username;
    snake.size = raw.size;
    snake.active = raw.active;
    snake.score = raw.score;
    snake.gameId = raw.gameId;
    return snake;
  }
}
