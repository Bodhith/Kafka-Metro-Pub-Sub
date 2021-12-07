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

app.get('/:userId', function(req, res) {
    let userId = req.params.userId;
    if(!userId) {
        res.send(404);
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



app.listen(port, () => {
    console.log(`Subscriber Application listening at http://localhost:${port}`)
  })