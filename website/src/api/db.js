import AWS from 'aws-sdk';
import https from 'https';

import { generateId, computeId } from './utils';

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

export const getItem = (pk, sk, ConsistentRead = false) =>
  db()['get']({ TableName, Key: { pk, sk }, ConsistentRead }).promise();

export const setItem = (pk, sk, payload, user = null, overwrite = true) => {
  const now = new Date().toISOString();

  const Item = {
    pk: pk ?? generateId(),
    sk,
    type: 'item',
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

export const setItemVersioned = (pk = generateId(), sk, payload, user = null) => {
  const now = new Date().toISOString();

  const version = (payload.version ?? 0) + 1;

  const params = {
    RequestItems: {
      [TableName]: [
        {
          PutRequest: {
            Item: {
              pk,
              sk,
              type: 'item',
              createdAt: now,
              createdBy: user,
              ...payload,
              version,
              updatedAt: now,
              updatedBy: user,
            },
          },
        },
        {
          PutRequest: {
            Item: {
              pk,
              type: 'item',
              createdAt: now,
              createdBy: user,
              ...payload,
              sk: `v${version}_${sk.replace(/^v(\d*)_/, '')}`,
              version,
              updatedAt: now,
              updatedBy: user,
            },
          },
        },
      ],
    },
  };

  console.log(JSON.stringify(params, null, 2));

  return db()['batchWrite'](params).promise();
};

// export const listItems = (pk, sk, IndexName) => {
//   let params = {
//     TableName,
//     KeyConditionExpression: 'pk = :pk and begins_with(sk, :sk)',
//     ExpressionAttributeValues: { ':pk': pk, ':sk': sk },
//   };

//   if (IndexName === 'sk-index') {
//     params = {
//       TableName,
//       IndexName,
//       KeyConditionExpression: 'sk = :sk',
//       ExpressionAttributeValues: {
//         ':sk': sk,
//       },
//       FilterExpression: 'attribute_not_exists(deletedAt)',
//     };
//   }

//   return db()['query'](params).promise();
// };

// export const listItemsByParent = parent => {
//   const params = {
//     TableName,
//     IndexName: 'parent-index',
//     KeyConditionExpression: 'parent = :parent',
//     ExpressionAttributeValues: {
//       ':parent': parent,
//     },
//     FilterExpression: 'attribute_not_exists(deletedAt)',
//   };

//   return db()['query'](params).promise();
// };

// export const listItemsByType = type => {
//   const params = {
//     TableName,
//     IndexName: 'type-index',
//     KeyConditionExpression: '#t = :type',
//     ExpressionAttributeNames: {
//       '#t': 'type',
//     },
//     ExpressionAttributeValues: {
//       ':type': type,
//     },
//     FilterExpression: 'attribute_not_exists(deletedAt)',
//   };

//   return db()['query'](params).promise();
// };

// export const pk2id = ({ pk, sk, ...rest }) => ({ id: `${pk}/${sk}`, pk, sk, ...rest });
