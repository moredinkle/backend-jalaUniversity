import express, { Request, Response } from "express";
import { AppDataSource } from "./database/data-source";
import bodyParser from "body-parser";
import fileRoutes from "./API/routes/file.routes";
import accountRoutes from "./API/routes/account.routes";
import errorMiddleware from "./utils/error-middleware";
import MQService from "./services/rabbitmq-service";
import responseTime from "response-time";
import { restResponseTimeHistogram, startMetricsServer } from "./utils/metrics";

async function startServer() {
  const app = express();
  const port = 3005;

  await AppDataSource.initialize();
  await MQService.getInstance().connect();
  MQService.getInstance().consumeMessage(MQService.getInstance().uploader_channel, "UPLOADER", "drive.*.*");

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
  app.use("/api/v1/accounts", accountRoutes);
  app.use("/api/v1/files", fileRoutes);
  app.use(errorMiddleware);

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
    startMetricsServer();
  });
}

startServer();
