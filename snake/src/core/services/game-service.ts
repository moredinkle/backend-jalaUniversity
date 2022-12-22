import "reflect-metadata";
import { injectable, inject } from "inversify";
import { IGameRepository } from "../repositories/Game-repository";
import {POSITION_TYPES,SNAKE_TYPES,GAME_TYPES,} from "../../types/class-types";
import { generateRandomNumber } from "../../utils/randomGenerator";
import SnakeService from "./snake-service";
import { ISnakeRepository } from "../repositories/snake-repository";
import PositionService from "./position-service";
import { IPositionRepository } from "../repositories/position-repository";
import { container } from "../../infraestructure/container";
import Game from "../entities/Game";
import { stringToGameState } from "../../utils/stringToGameState";
import Snake from "../entities/snake";
import Position from "../entities/position";

@injectable()
export default class GameService {
  private GameRepository: IGameRepository;

  constructor(@inject(GAME_TYPES.GameDataAccess) GameRepository: IGameRepository) {
    this.GameRepository = GameRepository;
  }

  async create(game: Game): Promise<number> {
    let newGameId = await this.GameRepository.create(game);
    game.id = newGameId;
    return newGameId;
  }


  async start(username: string, gameId: number): Promise<Game | undefined>{
    let game = await this.GameRepository.read(gameId);
    if(game.state !== "READY TO PLAY") {
      return undefined;
    }

    let activeGames = await this.GameRepository.readActiveGames();
    if (activeGames.length > 0) {
      activeGames.map(async (it) => {
        it.state = "ENDED";
        this.GameRepository.update(it);
        this.finish(it.id);
      });
    }
    await this.startBoard(game);
    await this.startSnake(game, username);
    return game;
  }


  async restart(gameId: number): Promise<number> {
    const snakeService = new SnakeService(container.get<ISnakeRepository>(SNAKE_TYPES.SnakeDataAccess));
    //primero leer juego por id para conseguir size y serpiente
    const oldGame = await this.GameRepository.read(gameId);
    const newGame = new Game(oldGame.boardSize);
    const newId = await this.create(newGame);
    newGame.id = newId;

    let snakes = await snakeService.readByGameId(gameId);
    await this.startBoard(newGame);
    await Promise.all(snakes.map(async(it) => {
      await this.startSnake(newGame, it.username);
    }))
    return newGame.id;
  }


  async finish(gameId: number){
    const snakeService = new SnakeService(container.get<ISnakeRepository>(SNAKE_TYPES.SnakeDataAccess));
    let gameSnakes = await snakeService.readByGameId(gameId);
    gameSnakes.map(async (it) => {
      it.active = false;
      await snakeService.update(it);
    });
    let game = await this.GameRepository.read(gameId);
    game.state = "ENDED";
    await this.GameRepository.update(game);
  }


  async startBoard(game: Game): Promise<void> {
    const positionService = new PositionService(container.get<IPositionRepository>(POSITION_TYPES.PositionDataAccess));
    await positionService.createAllBoardPositions(game.boardSize);
    await this.addFoodToBoard(game);
    game.state = "PLAYING";
    await this.GameRepository.update(game);
  }


  async startSnake(game: Game, username: string): Promise<number> {
    const snakeService = new SnakeService(container.get<ISnakeRepository>(SNAKE_TYPES.SnakeDataAccess));
    let snake = new Snake(username);
    snake.gameId = game.id;
    let snakeId = await snakeService.create(snake, game.boardSize);
    return snakeId;
  }


  async addFoodToBoard(game: Game): Promise<void> {
    const positionService = new PositionService(container.get<IPositionRepository>(POSITION_TYPES.PositionDataAccess));
    let foodCells = await positionService.readByOccupier("FOOD");
    if(foodCells.length > 0) {
      return;
    }
    let random = generateRandomNumber(game.boardSize);
    let validFoodPosition = false;
    let cell: Position
    while(!validFoodPosition) {
      const x = random.next().value;
      const y = random.next().value;
      cell = await positionService.readByCoordenates(x, y);
      if(cell.occupier == "EMPTY") {
        await positionService.updateCellState(cell, "FOOD");
        validFoodPosition = true;
      }
    }
  }



  async read(id: number): Promise<Game> {
    return await this.GameRepository.read(id);
  }


  //game control logic

  async updateGameState(id: number, gameState: string): Promise<void> {
    const game = await this.read(id);
    game.state = stringToGameState(gameState);
    return await this.GameRepository.update(game);
  }


  async updateBoardState(id: number): Promise<Position[] | undefined> {
    const snakeService = new SnakeService(container.get<ISnakeRepository>(SNAKE_TYPES.SnakeDataAccess));
    const positionService = new PositionService(container.get<IPositionRepository>(POSITION_TYPES.PositionDataAccess));

    let game = await this.read(id);
    if(game.state === "ENDED") {
      return undefined
    }
    let activeSnakes = await snakeService.readActiveSnakes();
    await this.updatePositionsState(game);

    await Promise.all(activeSnakes.map(async (it) => {
      let updatedSnake = await snakeService.updateSnakeHeadPosition(it, game.boardSize);
      if(!updatedSnake) {
        await this.finish(game.id);
        return undefined;
      }
      await this.putSnakeInBoard(updatedSnake);
    }));

    let foodCells = await positionService.readByOccupier("FOOD");
    if(foodCells.length === 0) {
      await this.addFoodToBoard(game);
    }
    let board = await positionService.readAllPositions();
    return board;
  }


  async updatePositionsState(game: Game) {
    const positionService = new PositionService(container.get<IPositionRepository>(POSITION_TYPES.PositionDataAccess));
    let snakeCells = await positionService.readByOccupier("SNAKE");
    await Promise.all( snakeCells.map(async (it) => {
      await positionService.updateCellState(it, "EMPTY");
    }));
  }


  async putSnakeInBoard(snake: Snake){
    const positionService = new PositionService(container.get<IPositionRepository>(POSITION_TYPES.PositionDataAccess));
    const nodes = snake.snakeNodes;
    await Promise.all( nodes.map(async (it) => {
      const position = await positionService.readByCoordenates(it.x, it.y);
      await positionService.updateCellState(position, "SNAKE");
    }));
  }


  async delete(id: number): Promise<number> {
    let deletedRows = await this.GameRepository.delete(id);
    if (deletedRows !== 0) {
      console.log(`Game with id:${id} deleted`);
    }
    return deletedRows;
  }
}
