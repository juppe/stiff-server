const AWS = require("aws-sdk");

AWS.config.update({
  region: "eu-north-1",
  endpoint: "http://localhost:8000"
});

const dynDb = new AWS.DynamoDB.DocumentClient();

async function getMessages() {
  var params = {
    TableName: "Messages"
  };

  try {
    const data = await dynDb.scan(params).promise();
    return data.Items;
  } catch (error) {
    console.log("Error fetching messages:", JSON.stringify(error, null, 2));
  }
}

async function writeMessage(data) {
  var params = {
    TableName: "Messages",
    Item: {
      username: data.username,
      message: data.message
    }
  };

  try {
    await dynDb.put(params).promise();
  } catch (error) {
    console.log("Error writing message:", JSON.stringify(error, null, 2));
  }
}

module.exports = {
  getMessages,
  writeMessage
};
