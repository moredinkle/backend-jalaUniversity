import { container } from "../src/infraestructure/container";
import { AppDataSource } from "../src/infraestructure/database/data-source";
import Snake from "../src/core/entities/snake";
import Position from "../src/core/entities/position";
import { ISnakeRepository } from "../src/core/repositories/snake-repository";
import SnakeService from '../src/core/services/snake-service';
import { IPositionRepository } from "../src/core/repositories/position-repository";
import PositionService from '../src/core/services/position-service';
import { SNAKE_TYPES, POSITION_TYPES } from "../src/types/class-types";

jest.setTimeout(10000);


describe("Unit test for Snake service", () => {
  const snakeService = new SnakeService(container.get<ISnakeRepository>(SNAKE_TYPES.SnakeDataAccess));
  const positionService = new PositionService(container.get<IPositionRepository>(POSITION_TYPES.PositionDataAccess));

  let testSnake = new Snake("testUser");
  testSnake.gameId = 1;

  beforeAll(async () => {
    await AppDataSource.initialize();
  });
  afterAll(async () => {
    await AppDataSource.destroy();
  });


  it('Should create a snake in the database and return the new Snake id', async () => {
    //!current board size is 10, snake at 4719
    const testSize = 10;
    const newSnakeId = await snakeService.create(testSnake, testSize);

    expect(typeof newSnakeId).toBe("number");
    expect(newSnakeId).toBeGreaterThan(0);


    const snakePositions = await positionService.readByOccupier("SNAKE");
    if(snakePositions){
        await positionService.updateAllByOccupier("SNAKE", "EMPTY");
        await positionService.updateCellState(snakePositions[0], "SNAKE");
        await snakeService.delete(newSnakeId);
    }
    
  });


  it('Should read a snake with a given id', async () => {
    //!snake id 2 has 2 snake nodes
    const validSnakeId = 2;
    const snake = await snakeService.read(validSnakeId);

    expect(snake.username).toBe("peter");
    expect(snake.score).toBe(302);
    expect(snake.snakeNodes).toHaveLength(2);
  });


  it("Should not throw error because it set all snakes as inactive", async () => {
    expect(snakeService.setAllAsInactive()).resolves.not.toThrow();

  });



  it("Should return an empty array for there are no active snakes currently", async () => {
    const snakes = await snakeService.readActiveSnakes();
    expect(snakes).toHaveLength(0);
  });


  it("Should return an array of snakes with a specific game id", async () => {
    //!game 5 has 2 snakes
    const validGameId = 5;
    const numberOfSnakesInGame = 2;
    const snakes = await snakeService.readByGameId(validGameId);
    expect(snakes).toHaveLength(numberOfSnakesInGame);
  });


  it("Should return a empty array of snakes with an invalid game id", async () => {
    const invalidGameId = 1000;
    const snakes = await snakeService.readByGameId(invalidGameId);
    expect(snakes).toHaveLength(0);
  });


  it("Should return an array of snakes ordered by score", async () => {
    const leaderboard = await snakeService.readLeaderboard();
    expect(leaderboard[0].score).toBeGreaterThanOrEqual(leaderboard[1].score);
  });


  it("Should return true for a direction change", async () => {
    //!Snake 1 currently has direction down
    const testSnake = await snakeService.read(1);
    const snakeDirectionUpdated = await snakeService.updateHeadDirection(testSnake.id, "RIGHT");
    expect(snakeDirectionUpdated).toBe(true);
    await snakeService.updateHeadDirection(testSnake.id, "DOWN");
  });


  it("Should return false for a forbidden direction change", async () => {
    //!Snake 1 currently has direction down
    const testSnake = await snakeService.read(1);
    const snakeDirectionUpdated = await snakeService.updateHeadDirection(testSnake.id, "UP");
    expect(snakeDirectionUpdated).toBe(false);
  });

});