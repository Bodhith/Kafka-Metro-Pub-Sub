const bodyParser = require('body-parser')
const express = require("express")
const request = require("request");
const path = require('path');
const kafka = require('kafka-node');
const session = require('express-session');

const app = express()
const port = 5000

app.use(express.static("static"))
app.use(session({secret:'XASDASDA'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
})); 

var ssn;

app.get('/:userId', function(req, res) {
    ssn = req.session;
    let userId = req.params.userId;
    if(!userId) {
        res.send(404);
    }
    getAlerts();
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

const getAlerts = function() {
    if( ssn != "undefined" ) {
        return ;
    }
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
    });
}


app.listen(port, () => {
    console.log(`Subscriber Application listening at http://localhost:${port}`)
  })