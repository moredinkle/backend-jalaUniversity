import { AppDataSource } from "../data-source";
import GameEntity from "../entities/game/game.entity";
import { injectable } from "inversify";
import { IGameRepository } from "../../../core/repositories/Game-repository";
import { GameMapper } from "../entities/game/game-mapper";
import { ObjectID } from 'typeorm';
import Game from '../../../core/entities/game';

@injectable()
export default class GameDataAccess implements IGameRepository {
  async create(game: Game) {
    const gameRepository = AppDataSource.getMongoRepository(GameEntity);
    const dbGame = GameMapper.toEntity(game);
    await gameRepository.save(dbGame);
    return dbGame.id.toString();
  }

  async read(id: string) {
    const repository = AppDataSource.getMongoRepository(GameEntity);
    let game = await repository.findOneBy({ id: id });
    return game ? GameMapper.toDomain(game) : undefined;
  }

  async readActiveGames() {
    const repository = AppDataSource.getMongoRepository(GameEntity);
    let activeGames = await repository.findBy({ state: "PLAYING" });
    return activeGames.map((it) => GameMapper.toDomain(it));
  }

  async update(game: Game) {
    const repository = AppDataSource.getMongoRepository(GameEntity);
    const dbGame = GameMapper.toEntity(game);
    await repository.save(dbGame);
  }

  async delete(id: string) {
    const repository = AppDataSource.getMongoRepository(GameEntity);
    const objectId = new ObjectID(id);
    let deleted = await repository.delete({ id: objectId });
    return deleted.affected;
  }
}