import { Connection } from 'mongoose';
import { AccountSchema } from './schemas/account.schema';
import { Account } from './interfaces/account.interface';

export const accountsProviders = [
  {
    provide: 'AccountModelToken',
    useFactory: (connection: Connection) => connection.model<Account>('Account', AccountSchema),
    inject: ['DbConnectionToken'],
  },
];
