var express = require("express");
var router = express.Router();

const { createUser, getUsers } = require("../actions").users;

/* GET users */
router.get("/", function(req, res) {
  getUsers().then(users => {
    res.send(users);
  });
});

/* CREATE user */
router.post("/", function(req, res) {
  createUser(req.body.username, req.body.fullname).then(result => {
    res.send({ response: "User created!" });
  });
});

module.exports = router;
