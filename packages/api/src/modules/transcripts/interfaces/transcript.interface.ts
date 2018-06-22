import { Schema, Document } from 'mongoose';

export interface Transcript extends Document {
  // readonly _id: String;
  label: String;
  desc: String;
  type: String;
  owner: String;
  namespace: String;
  meta: Schema.Types.Mixed;
  status: Schema.Types.Mixed;
  created: Date;
  modified: Date;
  content: String;
  data: Schema.Types.Mixed;
  media: String;
}
