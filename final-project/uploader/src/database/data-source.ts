import { DataSource } from 'typeorm';
import AccountEntity from './db-entities/account.entity';

export const AppDataSource = new DataSource({
    type: "mongodb",
    host: "127.0.0.1",
    port: 27017,
    database: "file-uploader",
    useUnifiedTopology: true,
    useNewUrlParser: true,
    synchronize: true,
    logging: false,
    entities: [AccountEntity],
    migrations: [],
    subscribers: [],
});
