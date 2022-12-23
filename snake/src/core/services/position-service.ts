import "reflect-metadata";
import { injectable, inject } from "inversify";
import { IPositionRepository } from "../repositories/Position-repository";
import { POSITION_TYPES } from "../../types/class-types";
import Position from "../entities/position";
import { stringToCellState } from "../../utils/stringToCellState";

@injectable()
export default class PositionService {
  private PositionRepository: IPositionRepository;

  constructor(@inject(POSITION_TYPES.PositionDataAccess)PositionRepository: IPositionRepository) {
    this.PositionRepository = PositionRepository;
  }

  async create(Position: Position): Promise<number> {
    return await this.PositionRepository.create(Position);
  }

  async readOne(id: number): Promise<Position> {
    return await this.PositionRepository.readOne(id);
  }

  async readAllPositions(): Promise<Position[]> {
    let board = await this.PositionRepository.readAllPositions();
    return board;
  }

  graphicBoard(board: Position[]){
    let boardRow = [];
    let graphicBoard = [];
    let boardSize = Math.round(Math.sqrt(board.length));
    let rowCount = boardSize-1;

    for (let i = 0; i < board.length; i++) {
      const position = board[i];
      if(position.occupier == "EMPTY"){
        boardRow.push("_");
      }
      else if(position.occupier == "SNAKE"){
        boardRow.push("o");
      }
      else{
        boardRow.push("w")
      }
      if(i === rowCount){
        graphicBoard.push(boardRow.slice());
        boardRow.splice(0);
        rowCount+=boardSize;
      }
    }
    return graphicBoard;
  }

  async readByCoordenates(x: number, y: number): Promise<Position> {
    return await this.PositionRepository.readByCoordenates(x, y);
  }

  async readByOccupier(occupier: string): Promise<Position[] | undefined> {
    return await this.PositionRepository.readByOccupier(occupier);
  }

  async updateAllByOccupier(oldO: string, newO: string) {
    const old = stringToCellState(oldO);
    const newOne = stringToCellState(newO);
    return await this.PositionRepository.updateAllByOccupier(old, newOne);

  }

  async createAllBoardPositions(size: number): Promise<void> {
    await this.clearBoard();

    let positions: Position[] = [];
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        const position = new Position(x, y);
        positions.push(position);
      }
    }
    return await this.PositionRepository.createAllBoardPositions(positions);
  }

  async checkIfFoodOnNewPosition(newXPosition: number, newYPosition: number): Promise<boolean> {
    let cell = await this.PositionRepository.readByCoordenates(newXPosition, newYPosition);
    if (cell.occupier == "FOOD") {
      return true;
    } else {
      return false;
    }
  }

  async checkSnakeOnNewPosition(newXPosition: number, newYPosition: number): Promise<boolean> {
    let cell = await this.PositionRepository.readByCoordenates(newXPosition, newYPosition);
    if (cell.occupier == "SNAKE") {
      return true;
    } else {
      return false;
    }
  }

  async updateCellState(position: Position, newOccupier: string): Promise<void> {
    try {
      position.occupier = stringToCellState(newOccupier);
      return await this.PositionRepository.updateCellState(position);
    } catch (error) {
      throw new Error('could not update cell occupier');
    }
  }


  async delete(id: number): Promise<number> {
    let deletedRows = await this.PositionRepository.delete(id);
    if (deletedRows !== 0) {
      console.log(`Position with id:${id} deleted`);
    }
    return deletedRows;
  }

  async clearBoard(): Promise<void> {
    return await this.PositionRepository.clearBoard();
  }
}
