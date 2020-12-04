// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { User, UserChannel, Channel, MediaChannel, Media } = initSchema(schema);

export {
  User,
  UserChannel,
  Channel,
  MediaChannel,
  Media
};