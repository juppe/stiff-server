import { config, DynamoDB } from 'aws-sdk'

config.update({
  region: 'eu-north-1',
  endpoint: 'http://localhost:8000'
})

var dynamodb = new DynamoDB()

var params = {
  TableName: 'Users',
  KeySchema: [
    { AttributeName: 'username', KeyType: 'HASH' },
    { AttributeName: 'fullname', KeyType: 'RANGE' }
  ],
  AttributeDefinitions: [
    { AttributeName: 'username', AttributeType: 'S' },
    { AttributeName: 'fullname', AttributeType: 'S' }
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 10,
    WriteCapacityUnits: 10
  }
}

dynamodb.createTable(params, function(err, data) {
  if (err) {
    console.error(
      'Unable to create table. Error JSON:',
      JSON.stringify(err, null, 2)
    )
  } else {
    console.log(
      'Created table. Table description JSON:',
      JSON.stringify(data, null, 2)
    )
  }
})
