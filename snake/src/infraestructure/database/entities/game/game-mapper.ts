import Game from "../../../../core/entities/game";
import GameEntity from "./game.entity";

export class GameMapper {
  static toDomain(raw: GameEntity): Game {
    const game = new Game(raw.boardSize);
    game.id = raw.id;
    game.state = raw.state;
    game.timer = raw.timer;
    game.boardSize = raw.boardSize;
    return game;
  }
}
