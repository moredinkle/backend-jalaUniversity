import { container } from "../../src/infraestructure/container";
import { AppDataSource } from "../../src/infraestructure/database/data-source";
import SnakeNode from "../../src/core/entities/snake-node";
import { ISnakeNodeRepository } from "../../src/core/repositories/snake-node-repository";
import SnakeNodeService from '../../src/core/services/snake-node-service';
import { SNAKE_NODE_TYPES } from "../../src/types/class-types";

jest.setTimeout(10000);


describe("Unit test for SnakeNode service", () => {
  const snakeNodeService = new SnakeNodeService(container.get<ISnakeNodeRepository>(SNAKE_NODE_TYPES.SnakeNodeDataAccess));

  let testSnakeNode = new SnakeNode(20,20);
  testSnakeNode.snakeId = 1;

  beforeAll(async () => {
    await AppDataSource.initialize();
  });
  afterAll(async () => {
    await AppDataSource.destroy();
  });


  it('Should create a snakeNode in the database and return the new SnakeNode id', async () => {
    const newSnakeNodeId = await snakeNodeService.create(testSnakeNode);

    expect(typeof newSnakeNodeId).toBe("number");
    expect(newSnakeNodeId).toBeGreaterThan(0);

    await snakeNodeService.delete(newSnakeNodeId);
  });


  it('Should create a snakeNode in a random position, x and y lesser than the given size', async () => {
    //current board size is 8
    const boardSize = 8;
    const newSnakeNodeId = await snakeNodeService.createInRandomPosition(testSnakeNode, boardSize);

    expect(typeof newSnakeNodeId).toBe("number");
    expect(newSnakeNodeId).toBeGreaterThan(0);

    const newNode = await snakeNodeService.read(newSnakeNodeId);

    expect(newNode.x).toBeLessThan(boardSize);
    expect(newNode.y).toBeLessThan(boardSize);

    await snakeNodeService.delete(newSnakeNodeId);
  });


  it("Should return one SnakeNode with a specific id", async () => {
    //cant really think for something better in time
    const validId = 5;
    const snakeNode = await snakeNodeService.read(validId);

    expect(typeof snakeNode.x).toBe("number");
    expect(typeof snakeNode.y).toBe("number");
  });


  it("Should return an array of SnakeNodes with a specific snake id", async () => {
    //snake 12 has 7 nodes
    const validSnakeId = 12;
    const snakeSize = 7;
    const snakeNodes = await snakeNodeService.readBySnakeId(validSnakeId);
    expect(snakeNodes).toHaveLength(snakeSize);
  });


  it("Should return true for food on a given position", async () => {
    //food currently on (2,2)
    testSnakeNode.x=2;
    testSnakeNode.y=2;
    const foodOnPosition = await snakeNodeService.checkFoodOnNewPosition(testSnakeNode);
    expect(foodOnPosition).toBe(true);
  });


  it("Should return false for food on a given position", async () => {
    testSnakeNode.x=2;
    testSnakeNode.y=6;
    const foodOnPosition = await snakeNodeService.checkFoodOnNewPosition(testSnakeNode);
    expect(foodOnPosition).toBe(false);
  });


  it("Should return true for snake on a given position", async () => {
    //food currently on (4,6)
    testSnakeNode.x=4;
    testSnakeNode.y=6;
    const snakeOnPosition = await snakeNodeService.checkIfDead(testSnakeNode);
    expect(snakeOnPosition).toBe(true);
  });


  it("Should return false for food on a given position", async () => {
    testSnakeNode.x=0;
    testSnakeNode.y=4;
    const snakeOnPosition = await snakeNodeService.checkIfDead(testSnakeNode);
    expect(snakeOnPosition).toBe(false);
  });


  //position control tests
  it("Should return 0, y + 1, y - 1 and testSize because SnakeNode is moving vertically, first UP and then down. Snake node starts at 19,19 ", async () => {
    let testSize = 20;
    let testDirection = "UP";
    testSnakeNode.x = 19;
    testSnakeNode.y = 19;
    
    let newNode = snakeNodeService.controlHeadNewPosition(testSnakeNode, testDirection, testSize)
    expect(newNode.y).toBe(0);

    testSnakeNode.y = 12;
    let shouldBe = testSnakeNode.y+1;
    newNode = snakeNodeService.controlHeadNewPosition(testSnakeNode, testDirection, testSize)
    expect(newNode.y).toBe(shouldBe);
    
    testSnakeNode.y = 0;
    testDirection = "DOWN";
    newNode = snakeNodeService.controlHeadNewPosition(testSnakeNode, testDirection, testSize)
    expect(newNode.y).toBe(testSize-1);

    testSnakeNode.y = 13;
    shouldBe = testSnakeNode.y-1
    newNode = snakeNodeService.controlHeadNewPosition(testSnakeNode, testDirection, testSize)
    expect(newNode.y).toBe(shouldBe);
  });


  it("Should return 0, x + 1, x - 1 and testSize because SnakeNode is moving horizontally, first RIGHT and then LEFT. Snake node starts at 19,19 ", async () => {
    let testSize = 20;
    let testDirection = "RIGHT";
    testSnakeNode.x = 19;
    testSnakeNode.y = 19;
    
    let newNode = snakeNodeService.controlHeadNewPosition(testSnakeNode, testDirection, testSize)
    expect(newNode.x).toBe(0);

    testSnakeNode.x = 12;
    let shouldBe = testSnakeNode.x+1;
    newNode = snakeNodeService.controlHeadNewPosition(testSnakeNode, testDirection, testSize)
    expect(newNode.x).toBe(shouldBe);
    
    testSnakeNode.x = 0;
    testDirection = "LEFT";
    newNode = snakeNodeService.controlHeadNewPosition(testSnakeNode, testDirection, testSize)
    expect(newNode.x).toBe(testSize-1);

    testSnakeNode.x = 13;
    shouldBe = testSnakeNode.x-1
    newNode = snakeNodeService.controlHeadNewPosition(testSnakeNode, testDirection, testSize)
    expect(newNode.x).toBe(shouldBe);
  });


  //direction tests
  it('Should change the direction of the snakeNode and return true', async () => {
    testSnakeNode.x = 20;
    testSnakeNode.y = 20;
    testSnakeNode.direction = "UP";
    const newDirection = "RIGHT";
    const newSnakeNodeId = await snakeNodeService.create(testSnakeNode);

    const directionChanged = await snakeNodeService.updateHeadDirection(newDirection, testSnakeNode);
    expect(directionChanged).toBe(true);

    await snakeNodeService.delete(newSnakeNodeId);
  });


  it('Should return false for forbidden movement', async () => {
    testSnakeNode.x = 20;
    testSnakeNode.y = 20;
    testSnakeNode.direction = "UP";
    const newDirection = "DOWN";
    const newSnakeNodeId = await snakeNodeService.create(testSnakeNode);

    const directionChanged = await snakeNodeService.updateHeadDirection(newDirection, testSnakeNode);
    expect(directionChanged).toBe(false);

    await snakeNodeService.delete(newSnakeNodeId);
  });

  
  it('Should return false for bad direction', async () => {
    testSnakeNode.x = 20;
    testSnakeNode.y = 20;
    testSnakeNode.direction = "UP";
    const newDirection = "DOWNa";
    const newSnakeNodeId = await snakeNodeService.create(testSnakeNode);

    const directionChanged = await snakeNodeService.updateHeadDirection(newDirection, testSnakeNode);
    expect(directionChanged).toBe(false);

    await snakeNodeService.delete(newSnakeNodeId);
  });



  it("Should delete a SnakeNode with a specific id", async () => {
    const SnakeNodeToDeleteId = await snakeNodeService.create(testSnakeNode);
    let affectedRows = await snakeNodeService.delete(SnakeNodeToDeleteId);
    expect(affectedRows).toBeGreaterThan(0);
  });


  it("Delete method should return 0 affected rows if it didnt find an id", async () => {
    const invalidId = 0;
    let affectedRows = await snakeNodeService.delete(invalidId);
    expect(affectedRows).toBeLessThanOrEqual(0);
  });
});
