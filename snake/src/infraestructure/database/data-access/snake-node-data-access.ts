import { AppDataSource } from "../data-source";
import SnakeNodeEntity from "../entities/snake-node/snake-node.entity";
import { injectable } from "inversify";
import { ISnakeNodeRepository } from "../../../core/repositories/snake-node-repository";
import { SnakeNodeMapper } from "../entities/snake-node/snake-node-mapper";
import SnakeNode from "../../../core/entities/snake-node";

@injectable()
export default class SnakeNodeDataAccess implements ISnakeNodeRepository {
  async create(snakeNode: SnakeNodeEntity) {
    const repository = AppDataSource.getRepository(SnakeNodeEntity);
    const created = await repository.insert(snakeNode);
    return created.generatedMaps[0].id;
  }

  async read(id: number) {
    const repository = AppDataSource.getRepository(SnakeNodeEntity);
    let snakeNode = await repository.findOneBy({ id: id });
    return snakeNode ? SnakeNodeMapper.toDomain(snakeNode) : undefined;
  }

  async readBySnakeId(snakeId: number): Promise<SnakeNode[]> {
    const repository = AppDataSource.getRepository(SnakeNodeEntity);
    let snakeNodes = await repository.findBy({ snakeId: snakeId });
    return snakeNodes ? snakeNodes.map((it) => SnakeNodeMapper.toDomain(it)) : undefined;
  }

  async update(snakeNode: SnakeNodeEntity): Promise<void> {
    const repository = AppDataSource.getRepository(SnakeNodeEntity);
    await repository.save(snakeNode);
  }

  async delete(id: number) {
    const repository = AppDataSource.getRepository(SnakeNodeEntity);
    let deleted = await repository.delete({ id: id });
    if (deleted.affected !== 0) console.log(`SnakeNode with id:${id} deleted`);
    return deleted.affected;
  }
}
