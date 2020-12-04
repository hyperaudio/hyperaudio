// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Channel, MediaChannel, Media } = initSchema(schema);

export {
  Channel,
  MediaChannel,
  Media
};