const express = require("express");
const dotenv = require("dotenv");
const { createServer } = require("https");
var fs = require( 'fs' );
const path = require("path");


dotenv.config();


const app = express();
const httpServer = createServer({
  key: fs.readFileSync("./server.key"),
  cert: fs.readFileSync("./server.cert")
},app);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  next();
});

app.use('/dist', express.static('dist'))

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
});

httpServer.listen(8000);




