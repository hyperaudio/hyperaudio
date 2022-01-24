// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Media, User } = initSchema(schema);

export {
  Media,
  User
};