import client, { Channel, Connection } from "amqplib";
import HttpError from "../utils/http-error";
import { DriveUploadCompleted, Exchange, DriveDeleteCompleted } from "../utils/types";
import FileDownloadService from "./file-download-service";
import logger from "jet-logger";
import DownloadUri from "../../../stats/src/utils/download-uri";
import FileReport from "../entities/file-report";
import FileReportService from "./file-report-service";
import AccountReportService from "./account-report-service";
import AccountReport from "../entities/account-report";
import DownloadUriService from "./download-uri-service";
import { AccountToDelete } from "../utils/types";
export default class MQService {
  private static _instance: MQService = new MQService();
  private _downloader_channel!: Channel;
  private _downloader_stats_channel!: Channel;
  private _connection!: Connection;
  private fileDownloadService: FileDownloadService;
  private fileReportService: FileReportService;
  private accountReportService: AccountReportService;
  private downloadUriService: DownloadUriService;

  get downloader_channel() {
    return this._downloader_channel;
  }

  get downloader_stats_channel() {
    return this._downloader_stats_channel;
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
      this._downloader_channel = await this._connection.createChannel();
      this._downloader_stats_channel = await this._connection.createChannel();
      this.fileDownloadService = new FileDownloadService();
      this.fileReportService = new FileReportService();
      this.accountReportService = new AccountReportService();
      this.downloadUriService = new DownloadUriService();
    } catch (error) {
      throw new HttpError(500, "Error on MQ connection");
    }
  }

  async publishMessage(
    channel: Channel,
    exchange: Exchange,
    routingKey: string,
    message: DriveUploadCompleted | DriveDeleteCompleted | DownloadUri[]
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
        async (data) => {
          if (data) {
            logger.imp(`Mensaje recibido en: ${data.fields.routingKey}`);
            if (data.fields.routingKey === "drive.upload.complete") {
              const filesObj = JSON.parse(data.content.toString()) as DriveUploadCompleted;
              logger.info("Saving uploaded file data");
              filesObj.data.map(async (file) => {
                await this.fileDownloadService.create(file);
              });
            } 
            else if (data.fields.routingKey === "drive.delete.complete") {
              const file = JSON.parse(data.content.toString()) as DriveDeleteCompleted;
              logger.imp("Deleting file");
              await this.fileDownloadService.deleteByUploaderId(file.uploaderDbId);
              await this.downloadUriService.deleteByFileId(file.uploaderDbId);
              const fileReport = await this.fileReportService.readByFileId(file.uploaderDbId);
              await this.fileReportService.deleteOne(fileReport.id);
            } 
            else if (data.fields.routingKey === "drive.account.delete") {
              const accountId = JSON.parse(data.content.toString()) as AccountToDelete;
              logger.imp("Deleting account");
              await this.fileDownloadService.deleteByAccountId(accountId.accountId);
              await this.downloadUriService.deleteByAccountId(accountId.accountId);
              await this.accountReportService.deleteByAccountId(accountId.accountId);
            } 
            else if (data.fields.routingKey === "stats.files.complete") {
              const reports = JSON.parse(data.content.toString()) as FileReport[];
              logger.info("File reports received");
              await this.fileReportService.receiveFromStats(reports);
            } 
            else if (data.fields.routingKey === "stats.accounts.complete") {
              const reports = JSON.parse(data.content.toString()) as AccountReport[];
              logger.info("Account reports received");
              await this.accountReportService.receiveFromStats(reports);
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
