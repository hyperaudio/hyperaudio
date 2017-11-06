import { Connection } from 'mongoose';
import { AccountSchema } from './schemas/account.schema';

export const accountsProviders = [
  {
    provide: 'AccountModelToken',
    useFactory: (connection: Connection) => connection.model('Account', AccountSchema),
    inject: ['DbConnectionToken'],
  },
];
