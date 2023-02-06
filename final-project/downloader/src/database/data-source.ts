import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 6543,
    username: "postgres",
    password: "admin",
    database: "downloader",
    synchronize: true,
    logging: true,
    entities: [],
    subscribers: [],
    migrations: [],
})
