var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Transcript = new mongoose.Schema({
  _id: String,
  label: String,
  desc: String,
  type: String,
  owner: String,
  namespace: String,
  meta: Schema.Types.Mixed,
  status: Schema.Types.Mixed,
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

Transcript.pre('save', function(next) {
  this.modified = new Date();
  next();
});

module.exports = mongoose.model('Transcripts', Transcript);
