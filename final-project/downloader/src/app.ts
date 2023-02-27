import express from "express";
import { AppDataSource } from "./database/data-source";
import bodyParser from "body-parser";
import fileDownloadRoutes from "./API/routes/file-download.routes";
import reportRoutes from "./API/routes/report.routes";
import MQService from "./services/rabbitmq-service";
import errorMiddleware from "../../uploader/src/utils/error-middleware";
import responseTime from "response-time";
import { Request, Response } from "express";
import { restResponseTimeHistogram, startMetricsServer } from './utils/metrics';

async function startServer() {
  const app = express();
  const port = 3000;

  await AppDataSource.initialize();
  await MQService.getInstance().connect();
  MQService.getInstance().consumeMessage(MQService.getInstance().downloader_channel, "UPLOADER-DOWNLOADER", "drive.*.*");
  MQService.getInstance().consumeMessage(MQService.getInstance().downloader_stats_channel,"STATS-DOWNLOADER","stats.*.*");

  app.use(
    responseTime((req: Request, res: Response, time: number) => {
      if (req?.route?.path) {
        restResponseTimeHistogram.observe(
          {
            method: req.method,
            route: req.route.path,
            status_code: res.statusCode,
          },
          time * 1000
        );
      }
    })
  );
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use("/api/v1/files", fileDownloadRoutes);
  app.use("/api/v1/reports", reportRoutes);
  
  app.use(errorMiddleware);

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);

    startMetricsServer();
  });
}

startServer();
