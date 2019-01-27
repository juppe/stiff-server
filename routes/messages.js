const express = require("express");
const router = express.Router();

const { getMessages } = require("../actions").messages;

/* GET messages */
router.get("/", function(req, res) {
  getMessages().then(messages => {
    res.send(messages);
  });
});

module.exports = router;
