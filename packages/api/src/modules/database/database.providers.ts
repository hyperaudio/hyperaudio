import * as mongoose from 'mongoose';

export const databaseProviders = [
  {
    provide: 'DbConnectionToken',
    useFactory: async (): Promise<mongoose.Connection> => {
      (mongoose as any).Promise = global.Promise;
      return await mongoose.connect('mongodb://127.0.0.1/hyperaudio02', {
        useMongoClient: true,
      });
    },
  },
];
