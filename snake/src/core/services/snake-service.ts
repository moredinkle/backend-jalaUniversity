import "reflect-metadata";
import { injectable, inject } from "inversify";
import { ISnakeRepository } from "../repositories/snake-repository";
import { ISnakeNodeRepository } from "../repositories/snake-node-repository";
import SnakeNodeService from "./snake-node-service";
import { IPositionRepository } from "../repositories/position-repository";
import PositionService from "./position-service";
import { container } from "../../infraestructure/container";
import Snake from "../entities/snake";
import { SNAKE_TYPES, SNAKE_NODE_TYPES, POSITION_TYPES } from "../../types/class-types";
import SnakeNode from "../entities/snake-node";

@injectable()
export default class SnakeService {
  private SnakeRepository: ISnakeRepository;

  constructor(@inject(SNAKE_TYPES.SnakeDataAccess) SnakeRepository: ISnakeRepository) {
    this.SnakeRepository = SnakeRepository;
  }

  async create(snake: Snake, size: number): Promise<number> {
    try {
      const snakeNodeService = new SnakeNodeService(container.get<ISnakeNodeRepository>(SNAKE_NODE_TYPES.SnakeNodeDataAccess));
      const newSnakeId = await this.SnakeRepository.create(snake);
      const snakeHead = snake.snakeNodes[0];
      snakeHead.snakeId = newSnakeId;
      await snakeNodeService.createInRandomPosition(snakeHead, size);
      return newSnakeId;
    } catch (error) {
      throw new Error("Could not create snake");
    }
  }

  async read(id: number): Promise<Snake> {
    let snake = await this.SnakeRepository.read(id);
    if (snake) {
      snake = await this.readNodes(snake);
    } else {
      snake = undefined;
    }
    return snake;
  }

  async readNodes(snake: Snake): Promise<Snake> {
    const snakeNodeService = new SnakeNodeService(container.get<ISnakeNodeRepository>(SNAKE_NODE_TYPES.SnakeNodeDataAccess));
    const nodes = await snakeNodeService.readBySnakeId(snake.id);
    snake.snakeNodes = nodes;
    return snake;
  }

  async readActiveSnakes(): Promise<Snake[]> {
    const snakeNodeService = new SnakeNodeService(container.get<ISnakeNodeRepository>(SNAKE_NODE_TYPES.SnakeNodeDataAccess));
    let activeSnakes = await this.SnakeRepository.readActiveSnakes();
    for (let i = 0; i < activeSnakes.length; i++) {
      const it = activeSnakes[i];
      const nodes = await snakeNodeService.readBySnakeId(it.id);
      activeSnakes[i].snakeNodes = nodes;
    }
    return activeSnakes;
  }

  async readByGameId(gameId: number): Promise<Snake[]>{
    let snakes =  await this.SnakeRepository.readByGameId(gameId);
    let gameSnakes = await Promise.all(snakes.map(async (it) => {
      it = await this.readNodes(it);
      return it;
    }));
    return gameSnakes;
  }

  async readLeaderboard(){
    let snakes = await this.SnakeRepository.readLeaderboard();
    return snakes.map(it => {return {username: it.username, score: it.score, gameId: it.gameId}})
  }


  async update(snake: Snake): Promise<void> {
    return await this.SnakeRepository.update(snake);
  }

  async updateHeadDirection(snakeId: number, direction: string): Promise<boolean> {
    try {
      const snakeNodeService = new SnakeNodeService(container.get<ISnakeNodeRepository>(SNAKE_NODE_TYPES.SnakeNodeDataAccess));
      let snake = await this.read(snakeId);
      if(!snake){
        return false;
      }
      let directionUpdated = await snakeNodeService.updateHeadDirection(direction, snake.snakeNodes[0]);
      if (directionUpdated) {
        return true;
      }
      return false;
    } catch (error) {
      throw error;
    }
  }


  async updateSnakeHeadPosition(snake: Snake, size: number): Promise<Snake | undefined> {
    const snakeNodeService = new SnakeNodeService(container.get<ISnakeNodeRepository>(SNAKE_NODE_TYPES.SnakeNodeDataAccess));
    const positionService = new PositionService(container.get<IPositionRepository>(POSITION_TYPES.PositionDataAccess));

    const headPreviousState = this.assignNode(snake.snakeNodes[0]);
    const lastNodePreviousState = this.assignNode(snake.snakeNodes[snake.size - 1]);
    const newHead = await snakeNodeService.updateHeadPosition(snake.snakeNodes[0],size);

    let SnakeOnNewHeadPosition = await snakeNodeService.checkIfDead(newHead);
    let FoodOnNewHeadPosition = await snakeNodeService.checkFoodOnNewPosition(newHead);
    let newHeadPosition = await positionService.readByCoordenates(newHead.x, newHead.y);

    if(SnakeOnNewHeadPosition || newHeadPosition.occupier == "SNAKE") {
      return undefined;
    }
    await positionService.updateCellState(newHeadPosition, "SNAKE");


    if (FoodOnNewHeadPosition) {
      snake = await this.growSnake(snake, lastNodePreviousState);
    }
    else {
      let oldTailPosition = await positionService.readByCoordenates(lastNodePreviousState.x, lastNodePreviousState.y);
      await positionService.updateCellState(oldTailPosition, "EMPTY");
    }

    if (snake.size > 1) {
      await this.updateSnakeTailPosition(snake, headPreviousState);
    }
    return snake;
  }


  assignNode(origin: SnakeNode): SnakeNode {
    const target = new SnakeNode(origin.x, origin.y);
    target.direction = origin.direction;
    return target;
  }


  async updateSnakeTailPosition(snake: Snake, headPreviousState: SnakeNode): Promise<void> {
    const snakeNodeService = new SnakeNodeService(container.get<ISnakeNodeRepository>(SNAKE_NODE_TYPES.SnakeNodeDataAccess));
    let previousNode = this.assignNode(headPreviousState);
    for (let i = 1; i < snake.size; i++) {
      const it = snake.snakeNodes[i];
      const currentNode = this.assignNode(it);
      it.x = previousNode.x;
      it.y = previousNode.y;
      it.direction = previousNode.direction;
      await snakeNodeService.update(it);
      previousNode = this.assignNode(currentNode);
    }
  }



  async growSnake(snake: Snake, lastNodePreviousState: SnakeNode): Promise<Snake> {
    const snakeNodeService = new SnakeNodeService(container.get<ISnakeNodeRepository>(SNAKE_NODE_TYPES.SnakeNodeDataAccess));
    let newSnakeNode = this.assignNode(lastNodePreviousState);
    newSnakeNode.snakeId = snake.id;
    await snakeNodeService.create(newSnakeNode);
    snake.size++;
    await this.update(snake);
    const updatedSnake = await this.read(snake.id);
    return updatedSnake;
  }


  async setAllAsInactive() {
    let snakes = await this.SnakeRepository.readActiveSnakes();
    await Promise.all(snakes.map(async (it) => {
      it.active = false;
      await this.SnakeRepository.update(it);
    }));
  }

  async delete(id: number): Promise<number> {
    let deletedSnakeId = await this.SnakeRepository.delete(id);
    if (deletedSnakeId !== 0) {
      console.log(`Snake with id:${id} deleted`);
    }
    return deletedSnakeId;
  }
}
