import Position from "../entities/Position";
import { CellState } from '../../types/types';

export interface IPositionRepository {
  //?
  create(position: Position): Promise<string>;
  readOne(id: string): Promise<Position | undefined>;
  readAllPositions(): Promise<Position[] | undefined>;
  readByCoordenates(x: number, y: number): Promise<Position | undefined>;
  readByOccupier(state: string): Promise<Position[] | undefined>;
  createAllBoardPositions(positions: Position[]): Promise<void>;
  updateCellState(position: Position): Promise<void>;
  updateAllByOccupier(old: CellState, newOne: CellState): Promise<void>;
  update(position: Position): Promise<void>;
  delete(id: string): Promise<number>;
  clearBoard(): Promise<void>;
}
