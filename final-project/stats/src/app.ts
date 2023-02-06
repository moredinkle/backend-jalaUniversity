import express from 'express';
import bodyParser from 'body-parser';
import * as rabbitmq from "./rabbitmq/rabbitmq-manager";

async function startServer() {
  const app = express();
  const port = 3002;
  const downloaderQueue = "downloader-stats";

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  const connection = await rabbitmq.createConnection();
  const channel = await rabbitmq.createChannel(connection, downloaderQueue);

  app.post("/downloader", async (req, res) => {
    await rabbitmq.sendMessageToQueue(channel, downloaderQueue, "Hello from stats");
    res.send("Message sent");
  });

  app.get("/downloader", async (req, res) => {
    await rabbitmq.consumeMessage(channel, downloaderQueue);
    res.send("Message received");
  });

  app.listen(port, () => console.log(`Stats server listening on port ${port}`));
}

startServer();