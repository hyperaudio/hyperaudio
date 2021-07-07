import { withSSRContext } from 'aws-amplify';
import { serializeModel } from '@aws-amplify/datastore/ssr';

import { Transcript, User, UserChannel, Channel, MediaChannel, Media } from 'src/models';
import { getItem, setItem, computeId } from 'src/util/api';

const users = async (req, res) => {
  try {
    const {
      query: { migrate },
      method,
      // body,
    } = req;

    const { DataStore } = withSSRContext({ req });

    let data, migrated;

    switch (method) {
      case 'GET':
        data = serializeModel(await DataStore.query(MediaChannel));
        // data = await Promise.all(
        //   data.map(async t => ({
        //     ...t,
        //     media2: await DataStore.query(Media, t.media),
        //   })),
        // );
        if (migrate) {
          // User
          // migrated = await Promise.all(
          //   data.map(({ id, name, bio, createdAt, updatedAt, username }) =>
          //     setItem(
          //       id,
          //       'v0_metadata',
          //       {
          //         type: 'User',
          //         version: 0,
          //         username,
          //         name,
          //         bio,
          //         createdAt,
          //         updatedAt,
          //       },
          //       id,
          //       false,
          //     ),
          //   ),
          // );
          // Channel
          // migrated = await Promise.all(
          //   data.map(({ id, title, description, createdAt, updatedAt, owner, tags, editors }) =>
          //     setItem(
          //       computeId(id, owner),
          //       'v0_metadata',
          //       {
          //         type: 'Channel',
          //         version: 0,
          //         parent: owner,
          //         title,
          //         description,
          //         tags,
          //         editors,
          //         createdAt,
          //         updatedAt,
          //       },
          //       owner,
          //       true,
          //     ),
          //   ),
          // );
          // Media/Channel
          // migrated = await Promise.allSettled(
          //   data.map(
          //     ({ media: { id, title, description, createdAt, updatedAt, owner, tags, url, metadata }, channel }) =>
          //       setItem(
          //         computeId(id, owner),
          //         'v0_metadata',
          //         {
          //           type: 'Media',
          //           version: 0,
          //           parent: computeId(channel.id, channel.owner),
          //           title,
          //           description,
          //           url,
          //           tags,
          //           metadata,
          //           createdAt,
          //           updatedAt,
          //         },
          //         owner,
          //         true,
          //       ),
          //   ),
          // );
          // Transcript/Media
          // migrated = await Promise.allSettled(
          //   data.map(({ id, title, description, createdAt, updatedAt, media2, tags, lang, url, metadata, status }) =>
          //     setItem(
          //       computeId(id, media2.owner),
          //       'v0_metadata',
          //       {
          //         type: 'Transcript',
          //         version: 0,
          //         parent: computeId(media2.id, media2.owner),
          //         title,
          //         description,
          //         url,
          //         lang,
          //         tags,
          //         status,
          //         createdAt,
          //         updatedAt,
          //       },
          //       media2.owner,
          //       true,
          //     ),
          //   ),
          // );
        }
        res.status(200).json({ data, migrate, migrated });
        break;
      default:
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

export default users;
