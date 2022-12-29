import { DataSource } from 'typeorm';
import SnakeEntity from './entities/snake/snake.entity';
import SnakeNodeEntity from './entities/snake-node/snake-node.entity';
import PositionEntity from './entities/position/position.entity';
import GameEntity from './entities/game/game.entity';

export const AppDataSource = new DataSource({
    type: "mongodb",
    host: "127.0.0.1",
    port: 27017,
    database: "snake",
    useUnifiedTopology: true,
    useNewUrlParser: true,
    synchronize: true,
    logging: false,
    entities: [PositionEntity, SnakeEntity, SnakeNodeEntity, GameEntity],
    migrations: [],
    subscribers: [],
});

// export const AppDataSource = new DataSource({
//     type: "mongodb",
//     host: "localhost",
//     port: 27017,
//     database: "snake",
// })