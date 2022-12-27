import express from "express";
import { positionRouter } from "./infraestructure/routes/position.routes";
import { snakeRouter } from "./infraestructure/routes/snake.routes";
import { gameRouter } from "./infraestructure/routes/game.routes";
import { AppDataSource } from "./infraestructure/mongodb/data-source";
const bodyParser = require("body-parser");

async function startServer() {
  const app = express();
  const port = 3000;

  let a = await AppDataSource.initialize();
  console.log(a.metadataTableName);

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(snakeRouter);
  app.use(gameRouter);
  // app.use(positionRouter);
  app.listen(port, () => console.log(`Server listening on port ${port}`));
}

startServer();
