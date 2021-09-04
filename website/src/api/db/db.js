import AWS from 'aws-sdk';
import https from 'https';

const DOCUMENT_CLIENT_KEY = Symbol('AWS.DynamoDB.DocumentClient');

const {
  API_AWS_ACCESS_KEY_ID: accessKeyId,
  API_AWS_SECRET_ACCESS_KEY: secretAccessKey,
  API_AWS_DEFAULT_REGION: region,
  // TABLE_PREFIX,
} = process?.env ?? {};

export const db = () => {
  if (!global[DOCUMENT_CLIENT_KEY])
    global[DOCUMENT_CLIENT_KEY] = new AWS.DynamoDB.DocumentClient({
      service:
        accessKeyId && secretAccessKey && region
          ? new AWS.DynamoDB({ accessKeyId, secretAccessKey, region })
          : new AWS.DynamoDB.DocumentClient(),
      httpOptions: {
        agent: new https.Agent({ keepAlive: true }),
      },
    });

  return global[DOCUMENT_CLIENT_KEY];
};

export const TableName = 'HA-DEV-02';
