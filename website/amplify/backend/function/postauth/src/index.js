/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_HYPERAUDIODATA_ARN
	STORAGE_HYPERAUDIODATA_NAME
	STORAGE_HYPERAUDIODATA_STREAMARN
Amplify Params - DO NOT EDIT */

const AWS = require('aws-sdk');

const {
  // ENV,
  REGION,
  TABLE_REGION,
  // STORAGE_HYPERAUDIODATA_ARN,
  STORAGE_HYPERAUDIODATA_NAME: TableName,
  // STORAGE_HYPERAUDIODATA_STREAMARN,
} = process.env;

AWS.config.update({ region: TABLE_REGION ?? REGION });
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async event => {
  console.log(JSON.stringify(event));

  const {
    triggerSource,
    request: {
      userAttributes: { sub: id, email },
    },
  } = event;

  if (triggerSource !== 'PostAuthentication_Authentication') return event;

  const pk = `user:${id}`;
  const sk = `v0_${pk}`;

  const { Item: user } = await dynamodb.get({ TableName, Key: { pk, sk }, ConsistentRead: false }).promise();

  // console.log(JSON.stringify(user));

  const now = new Date().toISOString();

  if (!user) {
    await dynamodb
      .put({
        TableName,
        Item: {
          id,
          pk,
          sk,
          gsi1pk: sk,
          gsi1sk: pk,
          type: 'user',
          version: 0,
          createdAt: now,
          createdBy: id,
          username: email.match(/^[a-z]+/gi)?.pop() ?? '',
          updatedAt: now,
          updatedBy: id,
          lastLoginAt: now,
        },
      })
      .promise();
  } else {
    await dynamodb
      .update({
        TableName,
        Key: { pk, sk },
        UpdateExpression: `SET lastLoginAt = :now`,
        ExpressionAttributeValues: {
          ':now': now,
        },
        ReturnValues: 'ALL_NEW',
      })
      .promise();
  }

  return event;
};
