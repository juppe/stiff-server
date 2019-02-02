import { config, DynamoDB } from 'aws-sdk'

config.update({
  region: 'eu-north-1',
  endpoint: 'http://localhost:8000'
})

const dynDb = new DynamoDB.DocumentClient()

const createUser = async (username, fullname) => {
  var params = {
    TableName: 'Users',
    Item: {
      username: username,
      fullname: fullname
    }
  }

  try {
    const data = await dynDb.put(params).promise()
    return data
  } catch (error) {
    console.error('Unable to add user:', JSON.stringify(error, null, 2))
  }
}

const getUsers = async () => {
  var params = {
    TableName: 'Users'
  }

  try {
    const data = await dynDb.scan(params).promise()
    return data.Items
  } catch (error) {
    console.log('Error fetching items:', JSON.stringify(error, null, 2))
  }
}

export const users = {
  createUser,
  getUsers
}
