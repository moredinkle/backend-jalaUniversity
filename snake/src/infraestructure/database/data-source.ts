import { DataSource } from 'typeorm';
import SnakeEntity from './entities/snake/snake.entity';
import SnakeNodeEntity from './entities/snake-node/snake-node.entity';
import PositionEntity from './entities/position/position.entity';
import GameEntity from './entities/game/game.entity';

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "database.sqlite",
    synchronize: true,
    logging: false,
    entities: [PositionEntity, SnakeEntity, SnakeNodeEntity, GameEntity],
    migrations: [],
    subscribers: [],
})