import Position from "../entities/Position";
import { CellState } from '../../types/types';

export interface IPositionRepository {
  //?
  create(position: Position): Promise<number>;
  readOne(id: number): Promise<Position | undefined>;
  readAllPositions(): Promise<Position[] | undefined>;
  readByCoordenates(x: number, y: number): Promise<Position | undefined>;
  readByOccupier(state: string): Promise<Position[] | undefined>;
  createAllBoardPositions(positions: Position[]): Promise<void>;
  updateCellState(position: Position): Promise<void>;
  updateAllByOccupier(old: CellState, newOne: CellState): Promise<void>;
  delete(id: number): Promise<number>;
  clearBoard(): Promise<void>;
}
