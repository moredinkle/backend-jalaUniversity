import client, { Channel, Connection } from "amqplib";
import StatsService from "./file-stats-service";
import logger from "jet-logger";
import { AccountInfo, Exchange, FileInfo } from "../utils/types";
import DownloadUri from '../utils/download-uri';

export default class MQService {
  private static _instance: MQService = new MQService();
  private _stats_channel!: Channel;
  private _connection!: Connection;
  private statsService: StatsService;

  get stats_channel() {
    return this._stats_channel;
  }

  constructor() {
    if (MQService._instance) {
      logger.warn("Use get instance");
      return;
    }
    MQService._instance = this;
  }

  public static getInstance(): MQService {
    return MQService._instance;
  }

  async connect() {
    try {
      this._connection = await client.connect(
        "amqp://admin:admin@localhost:5672"
      );
      this._stats_channel = await this._connection.createChannel();
      this.statsService = new StatsService();
    } catch (error) {
      logger.err(error.message);
    }
  }

  async publishMessage(
    channel: Channel,
    exchange: Exchange,
    routingKey: string,
    message: FileInfo | AccountInfo
  ) {
    try {
      await channel.assertExchange(exchange, "topic", { durable: false });
      channel.publish(
        exchange,
        routingKey,
        Buffer.from(JSON.stringify(message))
      );
      logger.info(`Mensaje enviado en ruta: ${routingKey}`);
      return message;
    } catch (error) {
      logger.err(error.message);
    }
  }

  async consumeMessage(
    channel: Channel,
    exchange: Exchange,
    routingKey: string
  ) {
    try {
      await channel.assertExchange(exchange, "topic", { durable: false });
      const { queue } = await channel.assertQueue("", { durable: false });
      channel.bindQueue(queue, exchange, routingKey);
      await channel.consume(
        queue,
        (data) => {
          if (data) {
            logger.imp(data.fields.routingKey);
            if (data.fields.routingKey === "stats.files.report") {
              const files = JSON.parse(data.content.toString()) as DownloadUri[];
              logger.info("Starting files report");
              this.statsService.getAllFilesInfo(files);
            }
            // } else if (data.fields.routingKey === "drive.delete.start") {
            //   const file = JSON.parse(data.content.toString()) as FileToUpload;
            //   logger.info("Starting drive delete");
            //   this.fileService.setupDriveDelete(file.data);
            // }
          }
        },
        { noAck: true }
      );
    } catch (error) {
      logger.err(error.message);
    }
  }
}
