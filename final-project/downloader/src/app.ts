import express from "express";
import { AppDataSource } from "./database/data-source";
import bodyParser from "body-parser";
import fileDownloadRoutes from './API/routes/file-download.routes'

async function startServer() {
  const app = express();
  const port = 3000;


  await AppDataSource.initialize();

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use('/api/v1/files',fileDownloadRoutes);

  app.listen(port, () => console.log(`Server listening on port ${port}`));
}

startServer();
