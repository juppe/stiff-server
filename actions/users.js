const AWS = require("aws-sdk");

AWS.config.update({
  region: "eu-north-1",
  endpoint: "http://localhost:8000"
});

const dynDb = new AWS.DynamoDB.DocumentClient();

async function createUser(username, fullname) {
  var params = {
    TableName: "Users",
    Item: {
      username: username,
      fullname: fullname
    }
  };

  try {
    const data = await dynDb.put(params).promise();
    return data;
  } catch (error) {
    console.error("Unable to add user:", JSON.stringify(error, null, 2));
  }
}

async function getUsers() {
  var params = {
    TableName: "Users"
  };

  try {
    const data = await dynDb.scan(params).promise();
    return data.Items;
  } catch (error) {
    console.log("Error fetching items:", JSON.stringify(error, null, 2));
  }
}

module.exports = {
  createUser,
  getUsers
};
