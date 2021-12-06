const express = require("express")

const app = express()
const port = 5000

app.get('/', function(req, res) {
    res.sendFile("F:\\COLLEGE\\DS\\PROJECT 2\\subscriber\\index.html")
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })