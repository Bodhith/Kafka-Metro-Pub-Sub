const { Kafka } = require('kafkajs')
 
const kafka = new Kafka({
  clientId: 'my-producer',
  brokers: ['kafka-1:19092', 'kafka-2:29092', 'kafka-3:39092']
})
 
const producer = kafka.producer()

const run = async () => {
  // Producing
  await producer.connect()
  await producer.send({
    topic: 'test-topic',
    messages: [
      { value: 'Hello KafkaJS user!' },
    ],
  })
}
 
run().catch(console.error)