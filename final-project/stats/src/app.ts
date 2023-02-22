import MQService from "./services/rabbitmq-service";
import logger from 'jet-logger';



async function startServer() {
  await MQService.getInstance().connect();
  MQService.getInstance().consumeMessage(MQService.getInstance().stats_channel, "STATS-DOWNLOADER", "stats.*.*");
  logger.imp("Listening messages");

}

startServer();