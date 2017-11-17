import { Schema, Document } from 'mongoose';

export interface Mix extends Document {
  // readonly _id: String;
  label: String;
  desc: String;
  type: String;
  owner: String;
  namespace: String;
  meta: Schema.Types.Mixed;
  created: Date;
  modified: Date;
  content: String;
  tags: [String];
  channel: String;
}
