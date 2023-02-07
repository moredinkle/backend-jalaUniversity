import express from "express";
import { AppDataSource } from './database/data-source';
import bodyParser from "body-parser";
import fileRoutes from './API/routes/file.routes';
import accountRoutes from './API/routes/account.routes';

async function startServer() {
  const app = express();
  const port = 3005;

  await AppDataSource.initialize();
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use('/api/v1/accounts',accountRoutes);
  app.use('/api/v1/files',fileRoutes);

  app.listen(port, () => console.log(`Server listening on port ${port}`));
}

startServer();