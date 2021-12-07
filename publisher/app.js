const express = require("express")
const request = require("request");
const path = require('path');

const app = express()
const port = 5000

app.use(express.static("static"))

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname,"index.html"));
});

app.get('/getAllTopics', function(req, ress) {
    request.get("http://Custom_API:4000/getAllTopics/pub", function(err, res, body) {   
        ress.send(JSON.parse(body), 200);
    });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })