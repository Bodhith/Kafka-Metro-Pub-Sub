const express = require("express")

const app = express()
const port = 5000

app.get('/', function(req, res) {
    res.send("publisher", 200)
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })