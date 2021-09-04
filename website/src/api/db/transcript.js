import { generateId, computeId } from '../utils';
import { db, TableName } from './db';

const version = 0; // FIXME

export const get = async ({ pk }) => {
  try {
    const { Items: transcriptItems } = await db()
      ['query']({
        TableName,
        KeyConditionExpression: 'pk = :pk and sk = :sk',
        ExpressionAttributeValues: { ':pk': pk, ':sk': 'v0_metadata' },
        FilterExpression: 'attribute_not_exists(deleted)',
      })
      .promise();

    if (!transcriptItems || transcriptItems.length === 0) return { data: { title: '404 Not Found', status: 404 } };

    const [{ title, createdAt, updatedAt, duration, language, src, status, blocks = [], changes = null }] =
      transcriptItems;

    const { Items: blockItems } = await db()
      ['query']({
        TableName,
        KeyConditionExpression: 'pk = :pk and begins_with(sk, :sk)',
        ExpressionAttributeValues: { ':pk': pk, ':sk': 'v0_block:' },
      })
      .promise();

    const data = {
      title,
      createdAt,
      updatedAt,
      duration,
      language,
      src,
      status,
      blocks: blocks.map(key => blockItems.find(({ sk }) => sk === `v0_block:${key}`)),
      changes,
    };

    return { data, version };
  } catch (error) {
    return { data: null, errors: [error], version };
  }
};

export const put = async ({ pk }) => {
  try {
    const { blocks, changes } = JSON.parse(event.body);

    const now = new Date().toISOString();
    const username = event.requestContext.identity.cognitoAuthenticationProvider.split(':').pop();

    return {
      data: [
        await Promise.all(
          changes
            .map(({ key, status = 'edited', ...attributes }) => ({
              pk,
              sk: `v0_block:${key}`,
              RowVersion: 0, // FIXME
              RowType: 'block',
              key,
              createdAt: now,
              updatedAt: now,
              createdBy: username,
              updatedBy: username,
              status,
              ...attributes,
            }))
            .map(Item => db()['put']({ TableName, Item }).promise()),
        ),
        await db()
          ['update']({
            TableName,
            Key: { pk, sk: 'v0_metadata' },
            UpdateExpression: `SET updatedAt = :now, updatedBy = :username, blocks = :blocks, changes = :changes, #s = :status`,
            ExpressionAttributeNames: {
              '#s': 'status',
            },
            ExpressionAttributeValues: {
              // RowVersion + 1
              ':now': now,
              ':username': username,
              ':status': 'edited', // FIXME corrected?
              ':blocks': blocks,
              ':changes': changes.map(({ key }) => key),
            },
            ReturnValues: 'ALL_NEW',
          })
          .promise(),
      ],
      version,
    };
  } catch (error) {
    return { data: null, errors: [error], version };
  }
};

export const duplicate = async ({ pk }) => {
  try {
    const now = new Date().toISOString();
    const username = event.requestContext.identity.cognitoAuthenticationProvider.split(':').pop();

    const { Items: transcriptItems } = await db()
      ['query']({
        TableName,
        KeyConditionExpression: 'pk = :pk and sk = :sk',
        ExpressionAttributeValues: { ':pk': pk, ':sk': 'v0_metadata' },
        FilterExpression: 'attribute_not_exists(deleted)',
      })
      .promise();

    if (!transcriptItems || transcriptItems.length === 0) return { data: { title: '404 Not Found', status: 404 } };

    const [transcriptItem] = transcriptItems;

    transcriptItem.pk = generateId();
    transcriptItem.updatedAt = now;
    transcriptItem.updatedBy = username;
    transcriptItem.title = `${transcriptItem.title} (duplicate)`;
    // transcriptItem.copyOf ???

    const { Items: blockItems } = await db()
      ['query']({
        TableName,
        KeyConditionExpression: 'pk = :pk and begins_with(sk, :sk)',
        ExpressionAttributeValues: { ':pk': pk, ':sk': 'v0_block:' },
      })
      .promise();

    return {
      data: {
        pk: transcriptItem.pk,
        results: [
          await Promise.all(
            blockItems.map(Item => {
              Item.pk = transcriptItem.pk;
              return db()['put']({ TableName, Item }).promise();
            }),
          ),
          await db()['put']({ TableName, Item: transcriptItem }).promise(),
        ],
      },
      version,
    };
  } catch (error) {
    return { data: null, errors: [error], version };
  }
};

export const reparagraph = async ({ pk }) => {
  try {
    const now = new Date().toISOString();
    const username = event.requestContext.identity.cognitoAuthenticationProvider.split(':').pop();

    const { Items: transcriptItems } = await db()
      ['query']({
        TableName,
        KeyConditionExpression: 'pk = :pk and sk = :sk',
        ExpressionAttributeValues: { ':pk': pk, ':sk': 'v0_metadata' },
        FilterExpression: 'attribute_not_exists(deleted)',
      })
      .promise();

    if (!transcriptItems || transcriptItems.length === 0) return { data: { title: '404 Not Found', status: 404 } };

    const [transcriptItem] = transcriptItems;

    transcriptItem.pk = generateId();
    transcriptItem.updatedAt = now;
    transcriptItem.updatedBy = username;
    transcriptItem.title = `${transcriptItem.title} (reparagraphed)`;
    // transcriptItem.copyOf ???

    const { Items: blockItems } = await db()
      ['query']({
        TableName,
        KeyConditionExpression: 'pk = :pk and begins_with(sk, :sk)',
        ExpressionAttributeValues: { ':pk': pk, ':sk': 'v0_block:' },
      })
      .promise();

    const blocks = transcriptItem.blocks
      .map(key => blockItems.find(({ sk }) => sk === `v0_block:${key}`))
      .reduce((acc, block) => {
        if (acc.length === 0) return [block];

        const pBlock = acc.pop();

        if (pBlock.speaker === block.speaker) {
          pBlock.end = block.end;
          const pOffset = pBlock.text.length;
          pBlock.text += ` ${block.text}`;
          pBlock.keys = pBlock.keys.concat(block.keys);
          pBlock.starts = pBlock.starts.concat(block.starts);
          pBlock.ends = pBlock.ends.concat(block.ends);
          pBlock.lengths = pBlock.lengths.concat(block.lengths);
          pBlock.offsets = pBlock.offsets.concat(block.offsets.map(offset => offset + pOffset + 1));

          return [...acc, pBlock];
        }

        return [...acc, pBlock, block];
      }, []);

    transcriptItem.blocks = blocks.map(({ sk }) => sk.substring(9));

    return {
      data: {
        pk: transcriptItem.pk,
        transcriptItem,
        blocks,
        results: [
          await Promise.all(
            blocks.map(Item => {
              Item.pk = transcriptItem.pk;
              return db()['put']({ TableName, Item }).promise();
            }),
          ),
          await db()['put']({ TableName, Item: transcriptItem }).promise(),
        ],
      },
      version,
    };
  } catch (error) {
    return { data: null, errors: [error], version };
  }
};
