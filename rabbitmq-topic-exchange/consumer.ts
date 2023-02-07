const amqp2 = require("amqplib");

async function topicExchangeConsumer() {
  try {
    const rabbitmqUrl = "amqp://localhost:5672";
    const connection = await amqp2.connect(rabbitmqUrl);
    const exchange = "animals";
    const exchangeType = "topic";
    const routingKey = process.argv[2];
    const options = {};
    let channel = await connection.createChannel();
    
    await channel.assertExchange(exchange, exchangeType, options);
    const { queue } = await channel.assertQueue("", options);
    channel.bindQueue(queue, exchange, routingKey);
    channel.consume(queue, (data) => {
        if(data){
            console.log("Received", JSON.parse(data.content.toString()));
            channel.ack(data, false);
        }
    });
  } catch (error) {
    console.error(error);
  }
}
topicExchangeConsumer();