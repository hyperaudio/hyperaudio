import { Connection } from 'mongoose';
import { MixSchema } from './schemas/mix.schema';

export const mixesProviders = [
  {
    provide: 'MixModelToken',
    useFactory: (connection: Connection) => connection.model('Mix', MixSchema),
    inject: ['DbConnectionToken'],
  },
];
