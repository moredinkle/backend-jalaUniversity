import { AppDataSource } from "../data-source";
import SnakeNodeEntity from "../entities/snake-node/snake-node.entity";
import { injectable } from "inversify";
import { ISnakeNodeRepository } from "../../../core/repositories/snake-node-repository";
import { SnakeNodeMapper } from "../entities/snake-node/snake-node-mapper";
import SnakeNode from "../../../core/entities/snake-node";
import { ObjectID } from 'typeorm';

@injectable()
export default class SnakeNodeDataAccess implements ISnakeNodeRepository {
  async create(snakeNode: SnakeNode) {
    const repository = AppDataSource.getMongoRepository(SnakeNodeEntity);
    const dbNode = SnakeNodeMapper.toEntity(snakeNode);
    await repository.save(dbNode);
    return dbNode.id.toString();
  }

  async read(id: string) {
    const repository = AppDataSource.getMongoRepository(SnakeNodeEntity);
    let snakeNode = await repository.findOneBy({ id: id });
    return snakeNode ? SnakeNodeMapper.toDomain(snakeNode) : undefined;
  }

  async checkSnakeNodePosition(x: number, y: number, snakeId: string){
    const repository = AppDataSource.getMongoRepository(SnakeNodeEntity);
    let snakeNode = await repository.findOneBy({ x: x, y: y, snakeId: snakeId });
    return snakeNode ? SnakeNodeMapper.toDomain(snakeNode) : undefined;
  }

  async readBySnakeId(snakeId: string): Promise<SnakeNode[]> {
    const repository = AppDataSource.getMongoRepository(SnakeNodeEntity);
    let snakeNodes = await repository.findBy({ snakeId: snakeId });
    return snakeNodes ? snakeNodes.map((it) => SnakeNodeMapper.toDomain(it)) : undefined;
  }

  async update(snakeNode: SnakeNode): Promise<void> {
    const repository = AppDataSource.getMongoRepository(SnakeNodeEntity);
    const dbNode = SnakeNodeMapper.toEntity(snakeNode);
    await repository.save(dbNode);
  }

  async delete(id: string) {
    const repository = AppDataSource.getMongoRepository(SnakeNodeEntity);
    const objectId = new ObjectID(id);
    let deleted = await repository.delete({ id: objectId });
    if (deleted.affected !== 0) console.log(`SnakeNode with id:${id} deleted`);
    return deleted.affected;
  }
}
