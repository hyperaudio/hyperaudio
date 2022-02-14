// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Transcript, Media, Channel, Remix, User, RemixMedia } = initSchema(schema);

export {
  Transcript,
  Media,
  Channel,
  Remix,
  User,
  RemixMedia
};