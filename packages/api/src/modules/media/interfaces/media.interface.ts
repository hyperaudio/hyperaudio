import { Schema, Document } from 'mongoose';

export interface Media extends Document {
  //  _id: String;
   label: String;
   desc: String;
   type: String;
   owner: String;
   namespace: String;
   meta: String;
   created: Date;
   modified: Date;
   source: Schema.Types.Mixed;
   tags: [String];
   channel: String;
}
