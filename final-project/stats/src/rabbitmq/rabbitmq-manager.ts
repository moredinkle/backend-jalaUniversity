import client, { Channel, Connection, ConsumeMessage } from "amqplib";

export async function createConnection(): Promise<Connection> {
  const connection: Connection = await client.connect(
    "amqp://admin:admin@localhost:5672"
  );
  return connection;
}

export async function createChannel(
  connection: Connection,
  queue: string
): Promise<Channel> {
  try {
    const channel = await connection.createChannel();
    await channel.assertQueue(queue, { durable: false });
    return channel;
  } catch (err) {
    throw err;
  }
}

export async function sendMessageToQueue(
  channel: Channel,
  queue: string,
  message: string
) {
  channel.sendToQueue(queue, Buffer.from(message));
  console.log("[x] Sent %s", message);
}

export async function consumeMessage(channel: Channel, queue: string) {
  channel.consume(
    queue,
    function (message: ConsumeMessage) {
      console.log(`Message:\n${message.content.toString()}`);
    },
    { noAck: true }
  );
}
