import { Connection } from 'mongoose';
import { MediaSchema } from './schemas/media.schema';

export const mediaProviders = [
  {
    provide: 'MediaModelToken',
    useFactory: (connection: Connection) => connection.model('Media', MediaSchema),
    inject: ['DbConnectionToken'],
  },
];
