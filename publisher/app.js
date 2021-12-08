const bodyParser = require('body-parser')
const express = require("express")
const request = require("request");
const path = require('path');
const Kafka = require('kafka-node')

const app = express()
const port = 5000

app.use(express.static("static"))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
})); 

app.get('/', function(req, res) {
    pushDataToKafka("station_code_10", "hello 10th station, bla");
    res.sendFile(path.join(__dirname,"index.html"));
});

app.get('/getAllTopics', function(req, ress) {
    request.get("http://Custom_API:4000/getAllTopics/pub", function(err, res, body) {   
        ress.send(JSON.parse(body), 200);
    });
});

app.post('/publish', function(req, ress) {
    request.post({
        url: "http://Custom_API:4000/publish",
        body: JSON.stringify({
            topicId: req.body.topicId,
            message: req.body.message
        })
    }, function(err, res, body) {
        pushDataToKafka("station_code_"+req.body.topicId.toString(), req.body.message)
        ress.send(204);
    });
});

app.post('/advertise', function(req, ress) {
    request.post({
        url: "http://Custom_API:4000/advertise",
        body: JSON.stringify({
            advertisement: req.body.advertisement
        })
    }, function(err, res, body) {
        ress.send(204);
    });
});

app.listen(port, () => {
    console.log(`Publisher Application listening at http://localhost:${port}`)
  }
);



const pushDataToKafka = (topicId, message) => {
    const Producer = Kafka.Producer;
    const client = new Kafka.KafkaClient({kafkaHost: "kafka-1:19092,kafka-2:29092,kafka-3:39092"});
    const producer = new Producer(client,  {requireAcks: 0, partitionerType: 2});
    const admin = new Kafka.Admin(client);

    var topicExists;

    topicExists = false;

    admin.listTopics((err, res) => {
        for(topic in res[1].metadata) {
            console.log(topic);
            if( topic == topicId ) {
                topicExists = true;
            }
        }
    });

    if( !topicExists ) {
        var topicsToCreate = [{
            topic: topicId,
            partitions: 2,
            replicationFactor: 2
        }]

        client.createTopics(topicsToCreate, function(error, result) {
            console.log("error", error, "result", result);
        });
    }
       
    let payloadToKafkaTopic = [
        {
            topic:topicId,
            messages: message
        }
    ];

    producer.on('ready', async function() {
        await producer.send(payloadToKafkaTopic, (err, data) => {
                console.log('data: ', data);
        });
    });
  
  };

