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

app.get('/:userId', function(req, res) {
    let userId = req.params.userId;
    if(!userId) {
        res.send(404);
    }
    if(!ssn) {
        //getAlerts();
        ssn = req.session;
    }
    res.sendFile(path.join(__dirname,"index.html"));
});

app.get('/getSubTopics/:userId', function(req, ress) {
    let userId = req.params.userId;
    if(!userId) {
        res.send(404);
    }
    request.get(`http://Custom_API:4000/getSubTopics/${userId}`, function(err, res, body) {   
        ress.send(JSON.parse(body), 200);
    });
});

const wss = new WebSocket.Server({server});
    
wss.on("connection", function(ws) {
    console.log("New Client Connected");

    ws.on("message", function(data) {
        console.log("Message recieved from Client", data);
    });

    ws.on("close", function() {
        console.log("Client Disconnected");
    });

    const client = new kafka.KafkaClient({idleConnection: 24 * 60 * 60 * 1000,  kafkaHost: "kafka-1:19092,kafka-2:29092,kafka-3:39092"});
    const Consumer = kafka.Consumer;
    
    let consumer = new Consumer(
    client,
    [{ topic: "station_code_10", partition: 0 }],
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
        ws.send(message.value)
    });
});

/* const getAlerts = function() {
    console.log("getAlerts");
    const wss = new WebSocket.Server({server});
    
    wss.on("connection", function(ws) {
        console.log("New Client Connected");
    
        ws.on("message", function(data) {
            console.log("Message recieved from Client", data);
        });
    
        ws.on("close", function() {
            console.log("Client Disconnected");
        });

        const client = new kafka.KafkaClient({idleConnection: 24 * 60 * 60 * 1000,  kafkaHost: "kafka-1:19092,kafka-2:29092,kafka-3:39092"});
        const Consumer = kafka.Consumer;
        
        let consumer = new Consumer(
        client,
        [{ topic: "station_code_10", partition: 0 }],
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
            ws.send(message.value)
        });
    });
}
 */

server.listen(port, () => {
    console.log(`Subscriber Application started on port ${server.address().port}`);
});