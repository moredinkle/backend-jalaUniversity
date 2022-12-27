import { Container } from "inversify";
import { BOARD_TYPES } from "../types/class-types";
import { POSITION_TYPES } from "../types/class-types";
import { IPositionRepository } from "../core/repositories/position-repository";
import positionDataAccess from "./mongodb/data-access/position-data-access";
import { SNAKE_TYPES } from "../types/class-types";
import { ISnakeRepository } from "../core/repositories/snake-repository";
import snakeDataAccess from "./mongodb/data-access/snake-data-access";
import { SNAKE_NODE_TYPES } from "../types/class-types";
import { ISnakeNodeRepository } from "../core/repositories/snake-node-repository";
import snakeNodeDataAccess from "./mongodb/data-access/snake-node-data-access";
import { GAME_TYPES } from "../types/class-types";
import { IGameRepository } from "../core/repositories/game-repository";
import gameDataAccess from "./mongodb/data-access/game-data-access";

const container = new Container();

container.bind<IPositionRepository>(POSITION_TYPES.PositionDataAccess).to(positionDataAccess);

container.bind<ISnakeRepository>(SNAKE_TYPES.SnakeDataAccess).to(snakeDataAccess);

container.bind<ISnakeNodeRepository>(SNAKE_NODE_TYPES.SnakeNodeDataAccess).to(snakeNodeDataAccess);

container.bind<IGameRepository>(GAME_TYPES.GameDataAccess).to(gameDataAccess);

export { container }