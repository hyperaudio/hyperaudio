import { Connection } from 'mongoose';
import { TranscriptSchema } from './schemas/transcript.schema';

export const transcriptsProviders = [
  {
    provide: 'TranscriptModelToken',
    useFactory: (connection: Connection) => connection.model('Transcript', TranscriptSchema),
    inject: ['DbConnectionToken'],
  },
];
