const bodyParser = require('body-parser')
const express = require("express")
const request = require("request");
const path = require('path');

const app = express()
const port = 5000

app.use(express.static("static"))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
})); 

app.get('/', function(req, res) {
    console.log(req.query.userId);
    if(req.query.userId != "undefined") {
        res.sendFile(path.join(__dirname,"index.html"));
    }
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
  })