import express from "express";
import { AppDataSource } from "./database/data-source";
import bodyParser from "body-parser";
import * as rabbitmq from "./services/rabbitmq-service";

async function startServer() {
  const app = express();
  const port = 3000;
  const uploaderQueue = "downloader-uploader";
  const statsQueue = "downloader-stats";

  await AppDataSource.initialize();
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  const connection = await rabbitmq.createConnection();
  const channel = await rabbitmq.createChannel(connection, uploaderQueue);

  app.post("/uploader", async (req, res) => {
    await rabbitmq.sendMessageToQueue(channel, uploaderQueue, "Hello from downloader");
    res.send("Message sent");
  });

  app.get("/uploader", async (req, res) => {
    await rabbitmq.consumeMessage(channel, uploaderQueue);
    res.send("Message received");
  });
  
  app.post("/stats", async (req, res) => {
    await rabbitmq.sendMessageToQueue(channel, statsQueue, "Hello");
    res.send("Message sent");
  });

  app.get("/stats", async (req, res) => {
    await rabbitmq.consumeMessage(channel, statsQueue);
    res.send("Message received");
  });

  app.listen(port, () => console.log(`Server listening on port ${port}`));
}

startServer();
