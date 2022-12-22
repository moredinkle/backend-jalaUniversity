import { AppDataSource } from "../data-source";
import GameEntity from "../entities/game/game.entity";
import { injectable } from "inversify";
import { IGameRepository } from "../../../core/repositories/Game-repository";
import { GameMapper } from "../entities/game/game-mapper";

@injectable()
export default class GameDataAccess implements IGameRepository {
  async create(Game: GameEntity) {
    const gameRepository = AppDataSource.getRepository(GameEntity);
    const created = await gameRepository.insert(Game);
    return created.generatedMaps[0].id;
  }

  async read(id: number) {
    const repository = AppDataSource.getRepository(GameEntity);
    let game = await repository.findOneBy({ id: id });
    return game ? GameMapper.toDomain(game) : undefined;
  }

  async readActiveGames() {
    const repository = AppDataSource.getRepository(GameEntity);
    let activeGames = await repository.findBy({ state: "PLAYING" });
    return activeGames.map((it) => GameMapper.toDomain(it));
  }

  async update(game: GameEntity) {
    const repository = AppDataSource.getRepository(GameEntity);
    let updated = await repository.save(game);
  }

  async delete(id: number) {
    const repository = AppDataSource.getRepository(GameEntity);
    let deleted = await repository.delete({ id: id });
    return deleted.affected;
  }
}
