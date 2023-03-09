// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Transcript, Media, User, Channel, Remix, RemixMedia } = initSchema(schema);

export {
  Transcript,
  Media,
  User,
  Channel,
  Remix,
  RemixMedia
};