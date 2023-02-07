const amqp = require("amqplib");
async function topicExchangePublisher() {
  try {
    const rabbitmqUrl = "amqp://localhost:5672";
    const connection = await amqp.connect(rabbitmqUrl);
    const exchange = "animals";
    const exchangeType = "topic";
    const routingKey = "animal.mammal.tiger";
    const options = {};
    const payload = {
      numberOfAnimal: 10,
      animalName: 'scott'
    };
    let channel = await connection.createChannel();
    await channel.assertExchange(exchange, exchangeType, options);
    channel.publish(
      exchange,
      routingKey,
      Buffer.from(JSON.stringify(payload)),
      options
    );
  } catch (error) {
    console.error(error);
  }
}
topicExchangePublisher();