import { Connection } from 'mongoose';
import { MetadataSchema } from './schemas/metadata.schema';

export const metadataProviders = [
  {
    provide: 'MetadataModelToken',
    useFactory: (connection: Connection) => connection.model('Metadata', MetadataSchema),
    inject: ['DbConnectionToken'],
  },
];
