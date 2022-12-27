import "reflect-metadata";
import { injectable, inject } from "inversify";
import { ISnakeNodeRepository } from "../repositories/snake-node-repository";
import SnakeNode from "../entities/snake-node";
import { SNAKE_NODE_TYPES, POSITION_TYPES } from "../../types/class-types";
import { generateRandomNumber } from "../../utils/randomGenerator";
import { stringToDirection } from "../../utils/stringToDirection";
import PositionService from "./position-service";
import { IPositionRepository } from "../repositories/position-repository";
import { container } from "../../infraestructure/container";
import SnakeMovementControl from "../../utils/snakeMovementControl";

@injectable()
export default class SnakeNodeService {
  private SnakeNodeRepository: ISnakeNodeRepository;

  constructor(@inject(SNAKE_NODE_TYPES.SnakeNodeDataAccess)SnakeNodeRepository: ISnakeNodeRepository) {
      this.SnakeNodeRepository = SnakeNodeRepository;
    }

  async create(snakeNode: SnakeNode): Promise<string> {
    return await this.SnakeNodeRepository.create(snakeNode);
  }

  async createInRandomPosition(snakeNode: SnakeNode,size: number): Promise<string> {
    const positionService = new PositionService(container.get<IPositionRepository>(POSITION_TYPES.PositionDataAccess));
    let random = generateRandomNumber(size);
    let validPosition = false;
    let createdId: string;
    while(!validPosition) {
      const x = random.next().value;
      const y = random.next().value;
      let cell = await positionService.readByCoordenates(x, y);
      if(cell.occupier == "EMPTY") {
        snakeNode.x = x;
        snakeNode.y = y;
        await positionService.updateCellState(cell, "SNAKE");
        createdId = await this.SnakeNodeRepository.create(snakeNode);
        validPosition = true;
      }
    }
    return createdId;
  }

  async read(id: string): Promise<SnakeNode> {
    return await this.SnakeNodeRepository.read(id);
  }

  async readBySnakeId(snakeId: string): Promise<SnakeNode[]> {
    return await this.SnakeNodeRepository.readBySnakeId(snakeId);
  }

  async update(SnakeNode: SnakeNode): Promise<void> {
    return await this.SnakeNodeRepository.update(SnakeNode);
  }

  //head position
  async updateHeadPosition(snakeNode: SnakeNode, size: number): Promise<SnakeNode | undefined> {
    const newPositionNode = this.controlHeadNewPosition(snakeNode, snakeNode.direction, size);
    await this.update(newPositionNode);
    return await this.read(snakeNode.id);
  }

  async checkFoodOnNewPosition(snakeNode: SnakeNode): Promise<boolean> {
    const positionService = new PositionService(container.get<IPositionRepository>(POSITION_TYPES.PositionDataAccess));
    const FoodOnNewPosition = await positionService.checkIfFoodOnNewPosition(snakeNode.x,snakeNode.y);
    if (FoodOnNewPosition) {
      return true;
    }
    else {
      return false;
    }
  }

  async checkIfDead(snakeNode: SnakeNode): Promise<boolean> {
    const positionService = new PositionService(container.get<IPositionRepository>(POSITION_TYPES.PositionDataAccess));
    const SnakeOnNewPosition = await positionService.checkSnakeOnNewPosition(snakeNode.x, snakeNode.y);
    if (SnakeOnNewPosition) {
      return true;
    }
    else {
      return false;
    }
  }

  controlHeadNewPosition(snakeNode: SnakeNode, direction: string, size: number): SnakeNode {
    const snakeMovementControl = new SnakeMovementControl();
    if (direction === "UP") {
      snakeNode.y = snakeMovementControl.upBorderMovementControl(size, snakeNode.y);
    }
    else if (direction === "DOWN") {
      snakeNode.y = snakeMovementControl.downBorderMovementControl(size, snakeNode.y);
    }
    else if (direction === "LEFT") {
      snakeNode.x = snakeMovementControl.leftBorderMovementControl(size, snakeNode.x);
    }
    else if (direction === "RIGHT") {
      snakeNode.x = snakeMovementControl.rightBorderMovementControl(size, snakeNode.x);
    }
    return snakeNode;
  }

  //direccion desde aca

  async updateHeadDirection(direction: string, snakeNode: SnakeNode): Promise<boolean> {
    if (direction == "UP" || direction == "DOWN" || direction == "LEFT" || direction == "RIGHT") {
      if (this.checkHeadDirectionChange(snakeNode.direction, direction)) {
        snakeNode.direction = stringToDirection(direction);
        await this.update(snakeNode);
        return true;
      }
    }
    return false;
  }

  async checkHeadInOtherSnake(head: SnakeNode){
    return await this.SnakeNodeRepository.checkSnakeNodePosition(head.x, head.y, head.snakeId);
  }

  checkHeadDirectionChange(currentDirection: string, newDirection: string) {
    let verticalDirections = ["UP", "DOWN"];
    let horizontalDirections = ["LEFT", "RIGHT"];
    //check for forbidden movement
    if (verticalDirections.find((it) => it === currentDirection) && verticalDirections.find((it) => it === newDirection)) {
      return false;
    }
    else if (horizontalDirections.find((it) => it === currentDirection) && horizontalDirections.find((it) => it === newDirection)) {
      return false;
    }
    return true;
  }

  async delete(id: string): Promise<number> {
    return await this.SnakeNodeRepository.delete(id);
  }
}
