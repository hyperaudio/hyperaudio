import { Schema, Document } from 'mongoose';

export interface Transcript extends Document {
  // readonly _id: String;
  readonly label: String;
  readonly desc: String;
  readonly type: String;
  readonly owner: String;
  readonly namespace: String;
  readonly meta: Schema.Types.Mixed;
  readonly status: Schema.Types.Mixed;
  readonly created: Date;
  readonly modified: Date;
  readonly content: String;
  readonly media: String;
}
