import { DataSource } from 'typeorm';
import FileDownloadEntity from './db-entities/file-download.entity';
import DownloadUriEntity from '../entities/download-uri';

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 6543,
    username: "postgres",
    password: "admin",
    database: "downloader",
    synchronize: true,
    logging: true,
    entities: [FileDownloadEntity, DownloadUriEntity],
    subscribers: [],
    migrations: [],
})
