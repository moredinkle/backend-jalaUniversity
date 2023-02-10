import client, { Channel, Connection, ConsumeMessage } from "amqplib";
import { Queue } from "../utils/types";
export default class MQService {
  static instance: MQService | null;
  private _channel!: Channel;
  private _connection!: Connection;

  get channel() {
    return this._channel;
  }

  constructor() {
    if (MQService.instance) {
      return MQService.instance;
    }

    MQService.instance = this;
  }

  async connect() {
    try {
      this._connection = await client.connect("amqp://admin:admin@localhost:5672");
      this._channel = await this._connection.createChannel();
    } catch (error) {
      throw new Error(
        "Error on conection of Message Broker Connection on Uploader"
      );
    }
  }

  async publishMessage(queue: Queue, message: string) {
    try {
      await this._channel.assertQueue(queue, { durable: false });
      await this._channel.sendToQueue(queue, Buffer.from(message));
      console.log("mensaje enviado");
      return message;
    } catch (error) {
      throw new Error("Error on MQ");
    }
  }

  async consumeMessage(queue: Queue, action: Function | undefined) {
    try {
      await this._channel.assertQueue(queue, { durable: false });
      await this._channel.consume(queue, (message) => {
        if(action) {
          action();
        }
      }, { noAck: true });
    } catch (error) {
      throw new Error("Error on MQ");
    }
  }
}




// export async function createConnection(): Promise<Connection> {
//   const connection: Connection = await client.connect(
//     "amqp://admin:admin@localhost:5672"
//   );
//   return connection;
// }

// export async function createChannel(
//   connection: Connection,
//   queue: string
// ): Promise<Channel> {
//   try {
//     const channel = await connection.createChannel();
//     await channel.assertQueue(queue, { durable: false });
//     return channel;
//   } catch (err) {
//     throw err;
//   }
// }

// export async function sendMessageToQueue(
//   channel: Channel,
//   queue: string,
//   message: string
// ) {
//   channel.sendToQueue(queue, Buffer.from(message));
//   console.log("[x] Sent %s", message);
// }

// export async function consumeMessage(channel: Channel, queue: string) {
//   channel.consume(
//     queue,
//     function (message: ConsumeMessage) {
//       console.log(`Message:\n${message.content.toString()}`);
//     },
//     { noAck: true }
//   );
// }