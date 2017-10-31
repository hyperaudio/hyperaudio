import * as mongoose from 'mongoose';

export const MixSchema = new mongoose.Schema({
  _id: String,
  label: String,
  desc: String,
  type: String,
  owner: String,
  namespace: String,
  meta: mongoose.Schema.Types.Mixed,
  created: {
    type: Date,
    default: Date.now
  },
  modified: {
    type: Date,
    default: Date.now
  },
  content: String,
  tags: [String],
  channel: String
}, {
  versionKey: false,
  collection: 'mixes'
});


MixSchema.pre('save', next => {
  this.modified = new Date();
  next();
});
