const kafka = require('kafka-node');

const Consumer = kafka.Consumer;
const client = new kafka.KafkaClient({idleConnection: 24 * 60 * 60 * 1000,  kafkaHost: "kafka-1:19092,kafka-2:29092,kafka-3:39092"});

let consumer = new Consumer(
client,
[{ topic: "sample3", partition: 0 }],
{
    autoCommit: true,
    fetchMaxWaitMs: 1000,
    fetchMaxBytes: 1024 * 1024,
    encoding: 'utf8',
    // fromOffset: false
}
);

consumer.on('message', function(message) {
    console.log('kafka ', message.value);
});
