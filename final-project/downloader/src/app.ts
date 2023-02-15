import express from "express";
import { AppDataSource } from "./database/data-source";
import bodyParser from "body-parser";
import fileDownloadRoutes from './API/routes/file-download.routes';
import MQService from "./services/rabbitmq-service";
import errorMiddleware from '../../uploader/src/utils/error-middleware';

async function startServer() {
  const app = express();
  const port = 3000;


  await AppDataSource.initialize();
  await MQService.getInstance().connect();
  MQService.getInstance().consumeMessage(MQService.getInstance().downloader_channel, "UPLOADER-DOWNLOADER", "drive.*.*");

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use('/api/v1/files',fileDownloadRoutes);
  // app.use(errorMiddleware);

  app.listen(port, () => console.log(`Server listening on port ${port}`));
}

startServer();
