import client, { Channel, Connection } from "amqplib";
import HttpError from "../utils/http-error";
import {
  DriveUploadCompleted,
  FileToUpload,
  Exchange,
  DriveDeleteCompleted,
  AccountToDeleteDownloader,
  AccountToDelete,
} from "../utils/types";
import FileService from "./file-service";
import logger from "jet-logger";
import Account from "../entities/account";
export default class MQService {
  private static _instance: MQService = new MQService();
  private _uploader_channel!: Channel;
  private _connection!: Connection;
  private fileService: FileService;

  get uploader_channel() {
    return this._uploader_channel;
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
      this._connection = await client.connect("amqp://admin:admin@localhost:5672");
      this._uploader_channel = await this._connection.createChannel();
      this.fileService = new FileService();
    } catch (error) {
      throw new HttpError(500, "Error on MQ connection");
    }
  }

  async publishMessage(
    channel: Channel,
    exchange: Exchange,
    routingKey: string,
    message:
      | FileToUpload
      | DriveUploadCompleted
      | DriveDeleteCompleted
      | AccountToDelete
      | AccountToDeleteDownloader
      | Account
  ) {
    try {
      await channel.assertExchange(exchange, "topic", { durable: false });
      channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)));
      logger.info(`Mensaje enviado en ruta: ${routingKey}`);
      return message;
    } catch (error) {
      throw new HttpError(500, "Error on MQ");
    }
  }

  async consumeMessage(channel: Channel, exchange: Exchange, routingKey: string) {
    try {
      await channel.assertExchange(exchange, "topic", { durable: false });
      const { queue } = await channel.assertQueue("", { durable: false });
      channel.bindQueue(queue, exchange, routingKey);
      await channel.consume(
        queue,
        (data) => {
          if (data) {
            logger.imp(data.fields.routingKey);
            if (data.fields.routingKey === "drive.upload.start") {
              const file = JSON.parse(data.content.toString()) as FileToUpload;
              logger.info("Starting drive upload");
              this.fileService.setupDriveUpload(file.data);
            } 
            else if (data.fields.routingKey === "drive.delete.start") {
              const file = JSON.parse(data.content.toString()) as FileToUpload;
              logger.info("Starting drive delete");
              this.fileService.setupDriveDelete(file.data);
            } 
            else if (data.fields.routingKey === "drive.account.delete") {
              const accountData = JSON.parse(data.content.toString()) as AccountToDelete;
              logger.info("Starting account delete");
              this.fileService.deleteAccountFiles(accountData.account, accountData.accountIndex);
            } 
            else if (data.fields.routingKey === "drive.account.create") {
              const account = JSON.parse(data.content.toString()) as Account;
              logger.info("Uploading to new account");
              this.fileService.setupNewAccountFiles(account);
            }
          }
        },
        { noAck: true }
      );
    } catch (error) {
      throw new HttpError(500, error.message);
    }
  }
}
