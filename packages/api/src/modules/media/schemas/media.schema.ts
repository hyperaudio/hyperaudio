import * as mongoose from 'mongoose';

export const MediaSchema = new mongoose.Schema({
  _id: String,
  label: String,
  desc: String,
  type: String,
  owner: String,
  namespace: String,
  meta: {
    type: String,
    ref: 'Metadata'
  },
  created: {
    type: Date,
    default: Date.now
  },
  modified: {
    type: Date,
    default: Date.now
  },
  source: mongoose.Schema.Types.Mixed,
  tags: [String],
  channel: String
}, {
  versionKey: false,
  collection: 'media'
});


// MediaSchema.pre('save', next => {
//   this.modified = new Date();
//   next();
// });
