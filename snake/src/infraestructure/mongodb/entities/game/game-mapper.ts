import Game from "../../../../core/entities/game";
import GameEntity from "./game.entity";
import { ObjectId } from 'mongodb';

export class GameMapper {
  static toDomain(raw: GameEntity): Game {
    const game = new Game(raw.boardSize);
    game.id = raw._id.toString();
    game.state = raw.state;
    game.timer = raw.timer;
    game.boardSize = raw.boardSize;
    return game;
  }

  static toEntity(raw: Game): GameEntity {
    const game = new GameEntity();
    if(raw.id) {
      game._id = new ObjectId(raw.id);
    }
    game.id = raw.id;
    game.boardSize = raw.boardSize;
    game.state = raw.state;
    game.timer = raw.timer;
    game.boardSize = raw.boardSize;
    return game;
  }
}