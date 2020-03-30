const { Kafka } = require("kafkajs");
const { delay } = require("bluebird");

const topic = 'EVENTS';
const numPartitions = 4;
const groupId = 'CONSUMER_GROUP_ID';

let client = new Kafka({
  brokers: ['kafka:9092'],
});

async function createTopic() {
  const admin = client.admin();
  await admin.connect();
  await admin.createTopics({
    topics: [{
      topic,
      numPartitions,
    }],
  });
  await admin.disconnect();
}

async function produce() {
  const producer = client.producer();
  await producer.connect();
  for (let id = 0; id < 50000; id++) {
    const message = { id };
    const messageStr = JSON.stringify(message);
    const partition = id % numPartitions;
    await producer.send({
      topic,
      messages: [{
        value: messageStr,
        partition,
      }],
    });
  }
  await producer.disconnect();
}

async function consume() {
  const consumer = client.consumer({
    groupId,
    maxBytesPerPartition: 1024,
    readUncommitted: false,
  });
  await consumer.connect();
  await consumer.subscribe({ topic });
  await consumer.run({
    autoCommitInterval: 500,
    partitionsConsumedConcurrently: 2,
    eachMessage: async ({ topic, partition, message }) => {
      const msg = JSON.parse(message.value.toString());
      if (partition === 0) {
        // 5 seconds delay on partition 0
        await delay(5 * 1000);
      }
      console.log(`Message processed from [${topic}:${partition}] with id [${msg.id}]`);
    },
  });
}

async function main() {
  await createTopic();
  produce();
  consume();
}

main();
