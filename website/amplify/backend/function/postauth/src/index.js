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
  STORAGE_HYPERAUDIODATA_ARN,
  STORAGE_HYPERAUDIODATA_NAME,
  // STORAGE_HYPERAUDIODATA_STREAMARN,
} = process.env;

AWS.config.update({ region: TABLE_REGION ?? REGION });

const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async event => {
  console.log(STORAGE_HYPERAUDIODATA_ARN, STORAGE_HYPERAUDIODATA_NAME, JSON.stringify(event));

  return event;
};
