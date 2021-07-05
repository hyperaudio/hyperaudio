// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Transcript, User, UserChannel, Channel, MediaChannel, Media } = initSchema(schema);

export {
  Transcript,
  User,
  UserChannel,
  Channel,
  MediaChannel,
  Media
};