import Game from "../../../../core/entities/game";
import GameEntity from "./game.entity";
import { ObjectID } from 'typeorm';

export class GameMapper {
  static toDomain(raw: GameEntity): Game {
    const game = new Game(raw.boardSize);
    game.id = raw.id.toString();
    game.state = raw.state;
    game.timer = raw.timer;
    game.boardSize = raw.boardSize;
    return game;
  }

  static toEntity(raw: Game): GameEntity {
    const game = new GameEntity();
    game.id = new ObjectID(raw.id);
    game.boardSize = raw.boardSize;
    game.state = raw.state;
    game.timer = raw.timer;
    game.boardSize = raw.boardSize;
    return game;
  }
}
