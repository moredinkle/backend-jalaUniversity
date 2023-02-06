import express from "express";
import { AppDataSource } from './database/data-source';
import bodyParser from "body-parser";
import * as rabbitmq from "./rabbitmq/rabbitmq-manager";

async function startServer() {
  const app = express();
  const port = 3005;
  const queue = "downloader-uploader";

  await AppDataSource.initialize();
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  const connection = await rabbitmq.createConnection();
  const channel = await rabbitmq.createChannel(connection, queue);

  app.post("/downloader", async (req, res) => {
    await rabbitmq.sendMessageToQueue(channel, queue, "Hello from uploader");
    res.send("Message sent");
  });

  app.get("/downloader", async (req, res) => {
    await rabbitmq.consumeMessage(channel, queue);
    res.send("Message received");
  });
  
  app.listen(port, () => console.log(`Server listening on port ${port}`));
}

startServer();