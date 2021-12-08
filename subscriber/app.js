const bodyParser = require('body-parser')
const express = require("express")
const request = require("request");
const path = require('path');
const kafka = require('kafka-node');
const session = require('express-session');
const WebSocket = require("ws");
const http = require('http');

const app = express()
const port = 5000

app.use(express.static("static"))
app.use(session({secret:'XASDASDA'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
})); 

const server = http.createServer(app);

var ssn;

var consumerTopics = [
    {
        topic: "station_code_1"
    }
];


app.get('/:userId', function(req, res) {
    let userId = req.params.userId;
    if(!userId) {
        res.send(404);
    }
    if(!ssn) {
        //getAlerts();
        ssn = req.session;
        ssn.userId = userId;
    }
    res.sendFile(path.join(__dirname,"index.html"));
});

app.get('/getSubTopics/:userId', function(req, ress) {
    let userId = req.params.userId;
    if(!userId) {
        res.send(404);
    }
    request.get(`http://Custom_API:4000/getSubTopics/${userId}`, function(err, res, body) {   
        let topics = JSON.parse(body);
        ress.send(topics, 200);
    });
});

app.get('/getOldFeedAlerts/:topicId', function(req, ress) {
    let topicId = req.params.topicId;
    request.get(`http://Custom_API:4000/getAlertsFromTopic/${topicId}`, function(err, res, body) {   
        let topicAlerts = JSON.parse(body);
        ress.send(topicAlerts, 200);
    });
});



const wss = new WebSocket.Server({server});
    
wss.on("connection", function(ws) {
    console.log("New Client Connected");

    const client = new kafka.KafkaClient({
        idleConnection: 24 * 60 * 60 * 1000,
        kafkaHost: "kafka-1:19092,kafka-2:29092,kafka-3:39092"
    });
    const Consumer = kafka.Consumer;

    var consumer;

    request.get(`http://Custom_API:4000/getSubTopics/${ssn.userId}`, function(err, res, body) {   
        let topics = JSON.parse(body);
        for(topicId in topics) {
            console.log(topicId);
            consumerTopics.push({
                topic: "station_code_"+topicId.toString()
            });
        }
        consumer = new Consumer(
            client,
            consumerTopics,
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
            ws.send(JSON.stringify({
                alert: message.value
            }));
        });
    });

    ws.on("message", function(data) {
        callFor = JSON.parse(data.toString())
        console.log("Message recieved from Client", callFor);
        if("subscribe" in callFor) {
            let topicId;
            let userId;

            userId = callFor.subscribe.userId;
            topicId = callFor.subscribe.topicId;

            request.post({
                url: "http://Custom_API:4000/subscribe",
                body: JSON.stringify({
                    subId: userId,
                    topicId: topicId
                })
            }, function(err, res, body) {
                if(consumer) {
                    consumer.addTopics(["sation_code_"+topicId.toString()], function(err, added) {
                        console.log("Added New Topic to Consumer");
                        ws.send(JSON.stringify({
                            updateTopics: true
                        }));
                    });
                }
            });
        }
        else if("unsubscribe" in callFor) {
            let topicId;
            let userId;

            userId = callFor.unsubscribe.userId;
            topicId = callFor.unsubscribe.topicId;

            request.post({
                url: "http://Custom_API:4000/unsubscribe",
                body: JSON.stringify({
                    subId: userId,
                    topicId: topicId
                })
            }, function(err, res, body) {
                if(consumer) {
                    consumer.removeTopics(["sation_code_"+topicId.toString()], function(err, removed) {
                        console.log("Removed Topic from Consumer");
                        ws.send(JSON.stringify({
                            updateTopics: true
                        }));
                    });
                }
            });
        }
    });

    ws.on("close", function() {
        console.log("Client Disconnected");
    });
});

server.listen(port, () => {
    console.log(`Subscriber Application started on port ${server.address().port}`);
});