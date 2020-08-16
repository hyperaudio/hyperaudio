import { Schema, Document } from 'mongoose';

export interface Metadata extends Document {
   // _id: String;
  youtube: Schema.Types.Mixed;
  download: Schema.Types.Mixed;
  probe: Schema.Types.Mixed;
  video: Schema.Types.Mixed;
  audio: Schema.Types.Mixed;
  m4a: Schema.Types.Mixed;
}
