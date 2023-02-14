import client, { Channel, Connection } from "amqplib";
import HttpError from "../utils/http-error";
import { DriveUploadCompleted, FileToUpload, Exchange,  DriveDeleteCompleted } from "../utils/types";
import FileService from "./file-service";
export default class MQService {
  static instance: MQService | null;
  private _uploader_channel!: Channel;
  private _downloader_channel!: Channel;
  private _stats_channel!: Channel;
  private _connection!: Connection;
  private fileService: FileService;

  get uploader_channel() {
    return this._uploader_channel;
  }

  get downloader_channel() {
    return this._downloader_channel;
  }

  get stats_channel() {
    return this._stats_channel;
  }

  constructor() {
    if (MQService.instance) {
      return MQService.instance;
    }
    
    MQService.instance = this;
    this.fileService = new FileService();
  }

  async connect() {
    try {
      this._connection = await client.connect("amqp://admin:admin@localhost:5672");
      this._downloader_channel = await this._connection.createChannel();
      this._uploader_channel = await this._connection.createChannel();
      this._stats_channel = await this._connection.createChannel();
      console.log("conectado");
    } catch (error) {
      throw new HttpError(500, "Error on MQ connection");
    }
  }

  async publishMessage(channel: Channel, exchange: Exchange, routingKey: string, message: FileToUpload | DriveUploadCompleted | DriveDeleteCompleted) {
    try {
      await channel.assertExchange(exchange, "topic", { durable: false });
      channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)));
      console.log("Mensaje enviado");
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
      await channel.consume(queue, (data) => {
        if(data) {
          console.log(`Message received. Routing key: ${routingKey}`);
          switch(routingKey){
            case 'drive.upload.start': {
              const file = JSON.parse(data.content.toString()) as FileToUpload;
              console.log("starting drive upload\n", file);
              this.fileService.setupDriveUpload(file.data);
            }
            case 'drive.delete.start': {
              const file = JSON.parse(data.content.toString()) as FileToUpload;
              this.fileService.setupDriveDelete(file.data);
            }
          }
        }
      }, { noAck: true });
    } catch (error) {
      throw new HttpError(500, error.message);
    }
  }
}