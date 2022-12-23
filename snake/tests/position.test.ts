import { container } from "../src/infraestructure/container";
import { AppDataSource } from "../src/infraestructure/database/data-source";
import Position from "../src/core/entities/position";
import { IPositionRepository } from "../src/core/repositories/position-repository";
import PositionService from '../src/core/services/position-service';
import { POSITION_TYPES } from "../src/types/class-types";


describe("Unit test for position service", () => {
  const positionService = new PositionService(container.get<IPositionRepository>(POSITION_TYPES.PositionDataAccess));

  const testPosition = new Position(200,200);

  beforeAll(async () => {
    await AppDataSource.initialize();
  });
  afterAll(async () => {
    await AppDataSource.destroy();
  });

  it('Should create a position in the database and return the new position id', async () => {
    const newPositionId = await positionService.create(testPosition);

    expect(typeof newPositionId).toBe("number");
    expect(newPositionId).toBeGreaterThan(0);

    await positionService.delete(newPositionId);
  });


  it("Should return one position with a specific id", async () => {
    const positionAtOrigin = await positionService.readByCoordenates(0,0);
    const position = await positionService.readOne(positionAtOrigin.id);

    expect(position.x).toBe(0);
    expect(position.y).toBe(0);
  });


  it("Should return undefined if it doesnt find the position", async () => {
      const idInvalidId = 0;
      const position = await positionService.readOne(idInvalidId);
      expect(position).toBeFalsy();
  });


  it("Should return all positions", async () => {
    //!currently 10*10 baord
    const positions = await positionService.readAllPositions();

    expect(positions).toHaveLength(10);
  });


  it("Should return one position by coordenates", async () => {
    const position = await positionService.readByCoordenates(0,0);
    expect(position.x).toBe(0);
    expect(position.y).toBe(0);
  });

  
  it("Should return only one position occupied by food", async () => {
    const positions = await positionService.readByOccupier("FOOD");
    expect(positions).toHaveLength(1);
  });


  it("Should return true for food in the given position", async () => {
    //putting food in a given position and then checking it
    const foodPosition = await positionService.readByCoordenates(6,4);
    const oldOccupier = foodPosition.occupier;
    await positionService.updateCellState(foodPosition, "FOOD");
    const foodOnPosition = await positionService.checkIfFoodOnNewPosition(6,4);
    expect(foodOnPosition).toBe(true);
    await positionService.updateCellState(foodPosition, oldOccupier);
  });


  it("Should return false for food in the given position", async () => {
    const foodPosition = await positionService.readByCoordenates(6,4);
    const oldOccupier = foodPosition.occupier;
    await positionService.updateCellState(foodPosition, "EMPTY");
    const foodOnPosition = await positionService.checkIfFoodOnNewPosition(6,4);
    expect(foodOnPosition).toBe(false);
    await positionService.updateCellState(foodPosition, oldOccupier);
  });


  it("Should return true for snake in the given position", async () => {
    //putting snake in position to check and reverting back to old state
    const snakePosition = await positionService.readByCoordenates(0,4);
    const oldOccupier = snakePosition.occupier;
    await positionService.updateCellState(snakePosition, "SNAKE");
    const snakeOnPosition = await positionService.checkSnakeOnNewPosition(0,4);
    expect(snakeOnPosition).toBe(true);
    await positionService.updateCellState(snakePosition, oldOccupier);
  });


  it("Should return false for snake in the given position", async () => {
    const snakePosition = await positionService.readByCoordenates(0,4);
    const oldOccupier = snakePosition.occupier;
    await positionService.updateCellState(snakePosition, "EMPTY");
    const snakeOnPosition = await positionService.checkSnakeOnNewPosition(0,4);
    expect(snakeOnPosition).toBe(false);
    await positionService.updateCellState(snakePosition, oldOccupier);
  });


  it('Should update a created position and not throw error', async () => {
    const newPositionId = await positionService.create(testPosition);
    const position = await positionService.readOne(newPositionId);
    
    expect(positionService.updateCellState(position,"SNAKE")).resolves.not.toThrow();

    await positionService.delete(newPositionId);
  });


  it("Should delete a position with a specific id", async () => {
    const positionToDeleteId = await positionService.create(testPosition);
    let affectedRows = await positionService.delete(positionToDeleteId);
    expect(affectedRows).toBeGreaterThan(0);
  });


  it("Delete method should return 0 affected rows if it didnt find an id", async () => {
    const invalidId = 0;
    let affectedRows = await positionService.delete(invalidId);
    expect(affectedRows).toBeLessThanOrEqual(0);
  });
});
