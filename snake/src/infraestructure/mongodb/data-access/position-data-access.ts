import { AppDataSource } from "../data-source";
import PositionEntity from "../entities/position/position.entity";
import { injectable } from "inversify";
import { IPositionRepository } from "../../../core/repositories/Position-repository";
import { PositionMapper } from "../entities/position/position-mapper";
import Position from "../../../core/entities/position";
import { CellState } from "../../../types/types";
import { ObjectId } from 'mongodb';

@injectable()
export default class positionDataAccess implements IPositionRepository {
  async create(position: Position) {
    const repository = AppDataSource.getMongoRepository(PositionEntity);
    const dbPosition = PositionMapper.toEntity(position);
    await repository.save(dbPosition);
    return dbPosition._id.toString();
  }

  async readOne(id: string) {
    const repository = AppDataSource.getMongoRepository(PositionEntity);
    let position = await repository.findOneBy(id);
    return position ? PositionMapper.toDomain(position) : undefined;
  }

  //array
  async readAllPositions() {
    const repository = AppDataSource.getMongoRepository(PositionEntity);
    let positions = await repository.find();
    return positions ? positions.map((position) => PositionMapper.toDomain(position)) : undefined;
  }

  async readByCoordenates(x: number, y: number): Promise<Position | undefined> {
    const repository = AppDataSource.getMongoRepository(PositionEntity);
    let position = await repository.findOneBy({ x: x, y: y });
    return position ? PositionMapper.toDomain(position) : undefined;
  }

  async readByOccupier(state: CellState): Promise<Position[] | undefined> {
    const repository = AppDataSource.getMongoRepository(PositionEntity);
    let positions = await repository.findBy({ occupier: state });
    return positions ? positions.map((it) => PositionMapper.toDomain(it)) : undefined;
  }

  async createAllBoardPositions(positions: Position[]): Promise<void> {
    const repository = AppDataSource.getMongoRepository(PositionEntity);
    await repository.save(positions);
  }

  async updateCellState(position: Position) {
    const repository = AppDataSource.getMongoRepository(PositionEntity);
    await repository.update(position.id, { occupier: position.occupier });
  }

  async updateAllByOccupier(old: CellState, newOne: CellState){
    const repository = AppDataSource.getMongoRepository(PositionEntity);
    // await repository.createQueryBuilder().update(PositionEntity)
    // .set({ occupier: newOne })
    // .where("occupier = :occupier", { occupier: old })
    // .execute()
  }

  async update(position: Position){
    const repository = AppDataSource.getMongoRepository(PositionEntity);
    await repository.update(position.id, { x: position.x, y: position.y, occupier: position.occupier });
  }

  async delete(id: string) {
    const repository = AppDataSource.getMongoRepository(PositionEntity);
    let deleted = await repository.delete(id);
    return deleted.affected;
  }

  async clearBoard(): Promise<void> {
    const repository = AppDataSource.getMongoRepository(PositionEntity);
    await repository.clear();
  }
}
