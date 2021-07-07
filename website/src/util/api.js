import AWS from 'aws-sdk';
import https from 'https';
import bs58 from 'bs58';
import { v4 as uuidv4, v5 as uuidv5 } from 'uuid';

const DOCUMENT_CLIENT_KEY = Symbol('AWS.DynamoDB.DocumentClient');

const db = () => {
  if (!global[DOCUMENT_CLIENT_KEY])
    global[DOCUMENT_CLIENT_KEY] = new AWS.DynamoDB.DocumentClient({
      service: new AWS.DynamoDB({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_DEFAULT_REGION,
      }),
      httpOptions: {
        agent: new https.Agent({ keepAlive: true }),
      },
    });

  return global[DOCUMENT_CLIENT_KEY];
};

const TableName = 'HA-DEV-02';

export const generateId = () => {
  const buffer = Buffer.alloc(16);
  uuidv4(null, buffer);
  return bs58.encode(buffer);
};

export const computeId = (name, namespace) => {
  const buffer = new Buffer(16);
  let ns = namespace;
  try {
    ns = Array.from(bs58.decode(namespace));
  } catch (ignored) {}
  uuidv5(name, ns, buffer);
  return bs58.encode(buffer);
};

export const getItem = (pk, sk) => db()['get']({ TableName, Key: { pk, sk } }).promise();

export const setItem = (pk, sk, payload, user = null, overwrite = true) => {
  const now = new Date().toISOString();

  const Item = {
    pk: pk ?? generateId(),
    sk,
    type: 'Item',
    version: 0,
    createdAt: now,
    createdBy: user,
    ...payload,
    updatedAt: now,
    updatedBy: user,
  };

  const params = {
    TableName,
    Item,
  };

  if (!overwrite) params.ConditionExpression = 'attribute_not_exists(pk) and attribute_not_exists(sk)';

  return db()['put'](params).promise();
};

export const listItems = (pk, sk, IndexName) => {
  let params = {
    TableName,
    KeyConditionExpression: 'pk = :pk and begins_with(sk, :sk)',
    ExpressionAttributeValues: { ':pk': pk, ':sk': sk },
  };

  if (IndexName === 'sk-index') {
    params = {
      TableName,
      IndexName,
      KeyConditionExpression: 'sk = :sk',
      ExpressionAttributeValues: {
        ':sk': sk,
      },
      FilterExpression: 'attribute_not_exists(deletedAt)',
    };
  }

  return db()['query'](params).promise();
};

export const listItemsByParent = parent => {
  const params = {
    TableName,
    IndexName: 'parent-index',
    KeyConditionExpression: 'parent = :parent',
    ExpressionAttributeValues: {
      ':parent': parent,
    },
    FilterExpression: 'attribute_not_exists(deletedAt)',
  };

  return db()['query'](params).promise();
};

export const listItemsByType = type => {
  const params = {
    TableName,
    IndexName: 'type-index',
    KeyConditionExpression: '#t = :type',
    ExpressionAttributeNames: {
      '#t': 'type',
    },
    ExpressionAttributeValues: {
      ':type': type,
    },
    FilterExpression: 'attribute_not_exists(deletedAt)',
  };

  return db()['query'](params).promise();
};

// export const pk2id = ({ pk, sk, ...rest }) => ({ id: `${pk}/${sk}`, pk, sk, ...rest });
