const express = require("express");
const router = express.Router();

const { hello } = require("../actions").hello;

router.get("/", function(req, res) {
  var response = hello();
  res.send({
    response: response
  });
});

module.exports = router;
