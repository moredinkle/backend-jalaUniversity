import { AppDataSource } from "../data-source";
import PositionEntity from "../entities/position/position.entity";
import { injectable } from "inversify";
import { IPositionRepository } from "../../../core/repositories/Position-repository";
import { PositionMapper } from "../entities/position/position-mapper";
import Position from "../../../core/entities/position";
import { CellState } from "../../../types/types";

@injectable()
export default class positionDataAccess implements IPositionRepository {
  async create(Position: PositionEntity) {
    const repository = AppDataSource.getRepository(PositionEntity);
    const created = await repository.insert(Position);
    return created.generatedMaps[0].id;
  }

  async readOne(id: number) {
    const repository = AppDataSource.getRepository(PositionEntity);
    let position = await repository.findOneBy({ id: id });
    return position ? PositionMapper.toDomain(position) : undefined;
  }

  //array
  async readAllPositions() {
    const repository = AppDataSource.getRepository(PositionEntity);
    let positions = await repository.find();
    return positions ? positions.map((position) => PositionMapper.toDomain(position)) : undefined;
  }

  async readByCoordenates(x: number, y: number): Promise<Position | undefined> {
    const repository = AppDataSource.getRepository(PositionEntity);
    let position = await repository.findOneBy({ x: x, y: y });
    return position ? PositionMapper.toDomain(position) : undefined;
  }

  async readByOccupier(state: CellState): Promise<Position[] | undefined> {
    const repository = AppDataSource.getRepository(PositionEntity);
    let positions = await repository.findBy({ occupier: state });
    return positions ? positions.map((it) => PositionMapper.toDomain(it)) : undefined;
  }

  async createAllBoardPositions(positions: Position[]): Promise<void> {
    const repository = AppDataSource.getRepository(PositionEntity);
    await repository.save(positions);
  }

  async updateCellState(position: Position) {
    const repository = AppDataSource.getRepository(PositionEntity);
    await repository.update(position.id, { occupier: position.occupier });
  }

  async delete(id: number) {
    const repository = AppDataSource.getRepository(PositionEntity);
    let deleted = await repository.delete({ id: id });
    return deleted.affected;
  }

  async clearBoard(): Promise<void> {
    const repository = AppDataSource.getRepository(PositionEntity);
    await repository.clear();
  }
}
