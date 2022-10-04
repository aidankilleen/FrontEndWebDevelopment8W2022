console.log("Node Backend Server");

const express = require('express');
const app = express();
const port = 3000;

app.get('/', function(req, res) {
    res.send("<h1>Express Server Working?</h1>");
});

app.listen(port, function() {
    console.log(`Webserver listening on port ${port}`);
});









