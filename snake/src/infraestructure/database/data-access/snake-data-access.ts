import { AppDataSource } from "../data-source";
import SnakeEntity from "../entities/snake/snake.entity";
import { injectable } from "inversify";
import { ISnakeRepository } from "../../../core/repositories/snake-repository";
import { SnakeMapper } from "../entities/snake/snake-mapper";

@injectable()
export default class SnakeDataAccess implements ISnakeRepository {
  async create(snake: SnakeEntity) {
    const snakeRepository = AppDataSource.getRepository(SnakeEntity);
    const created = await snakeRepository.insert(snake);
    return created.generatedMaps[0].id;
  }

  async read(id: number) {
    const repository = AppDataSource.getRepository(SnakeEntity);
    let Snake = await repository.findOneBy({ id: id });
    return Snake ? SnakeMapper.toDomain(Snake) : undefined;
  }

  async readActiveSnakes() {
    const repository = AppDataSource.getRepository(SnakeEntity);
    let activeSnakes = await repository.findBy({ active: true });
    return activeSnakes.map((it) => SnakeMapper.toDomain(it));
  }

  async readByGameId(gameId: number) {
    const repository = AppDataSource.getRepository(SnakeEntity);
    let gameSnakes = await repository.findBy({ gameId: gameId });
    return gameSnakes.map((it) => SnakeMapper.toDomain(it));
  }

  async update(snake: SnakeEntity) {
    const repository = AppDataSource.getRepository(SnakeEntity);
    let updated = await repository.save(snake);
    console.log(`Snake with id:${updated.id} updated`);
  }

  async delete(id: number) {
    const repository = AppDataSource.getRepository(SnakeEntity);
    let deleted = await repository.delete({ id: id });
    return deleted.affected;
  }
}
