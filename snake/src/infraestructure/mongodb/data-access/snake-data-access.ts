import { AppDataSource } from "../data-source";
import SnakeEntity from "../entities/snake/snake.entity";
import { injectable } from "inversify";
import { ISnakeRepository } from "../../../core/repositories/snake-repository";
import { SnakeMapper } from "../entities/snake/snake-mapper";
import Snake from '../../../core/entities/snake';
import { ObjectID } from 'typeorm';

@injectable()
export default class SnakeDataAccess implements ISnakeRepository {
  async create(snake: Snake) {
    const snakeRepository = AppDataSource.getMongoRepository(SnakeEntity);
    const dbSnake = SnakeMapper.toEntity(snake);
    await snakeRepository.save(dbSnake);
    return dbSnake.id.toString();
  }

  async read(id: string) {
    const repository = AppDataSource.getMongoRepository(SnakeEntity);
    let Snake = await repository.findOneBy({ id: id });
    return Snake ? SnakeMapper.toDomain(Snake) : undefined;
  }

  async readActiveSnakes() {
    const repository = AppDataSource.getMongoRepository(SnakeEntity);
    let activeSnakes = await repository.findBy({ active: true });
    return activeSnakes.map((it) => SnakeMapper.toDomain(it));
  }

  async readByGameId(gameId: string) {
    const repository = AppDataSource.getMongoRepository(SnakeEntity);
    let gameSnakes = await repository.findBy({ gameId: gameId });
    return gameSnakes.map((it) => SnakeMapper.toDomain(it));
  }


  async readLeaderboard(){
    const repository = AppDataSource.getMongoRepository(SnakeEntity);
    let snakes = await repository.find({ order: { score: "DESC", } });
    return snakes.map(it => SnakeMapper.toDomain(it));
  }

  async update(snake: Snake) {
    const repository = AppDataSource.getMongoRepository(SnakeEntity);
    const dbSnake = SnakeMapper.toEntity(snake);
    await repository.save(dbSnake);
  }

  async delete(id: string) {
    const repository = AppDataSource.getMongoRepository(SnakeEntity);
    const objectId = new ObjectID(id);
    let deleted = await repository.delete({ id: objectId });
    return deleted.affected;
  }
}
