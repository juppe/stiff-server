var express = require("express");
var bodyParser = require("body-parser");
const socketIO = require("socket.io");

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

server = app.listen(process.env.PORT || 3001);
app.io = socketIO(server);

/* Routes to REST API and Websockets endpoints */
var routes = require("./routes")(app.io);

app.use("/", routes);

module.exports = app;
