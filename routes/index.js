var app = require("express")();

app.get("/", function(req, res) {
  res.json({ msg: "I'm alive!" });
});

app.use("/api/hello", require("./hello"));
app.use("/api/users", require("./users"));
app.use("/api/messages", require("./messages"));

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Not found!" });
});

const { writeMessage } = require("../actions").messages;

module.exports = io => {
  // Socket.IO
  io.on("connection", socket => {
    console.log("User connected");

    socket.on("send_message", data => {
      io.emit("receive_message", data);
      writeMessage(data);
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });

  return app;
};
