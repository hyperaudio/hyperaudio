import * as mongoose from 'mongoose';

export const TranscriptSchema = new mongoose.Schema({
  _id: String,
  label: String,
  desc: String,
  type: String,
  owner: String,
  namespace: String,
  meta: mongoose.Schema.Types.Mixed,
  status: mongoose.Schema.Types.Mixed,
  created: {
    type: Date,
    default: Date.now
  },
  modified: {
    type: Date,
    default: Date.now
  },
  content: String,
  media: {
    type: String,
    ref: 'Media'
  } //,
  // alignments: Schema.Types.Mixed
}, {
  versionKey: false,
  collection: 'transcripts'
});


// TranscriptSchema.pre('save', next => {
//   this.modified = new Date();
//   next();
// });
