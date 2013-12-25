var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Transcript = new mongoose.Schema({
  label: String,
  desc: String,
  type: String,
  // sort: { type: Number },
  owner: String,
  meta: Schema.Types.Mixed,
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
  _id: false,
  collection: 'transcripts'
});

Transcript.pre('save', function(next) {
  this.modified = new Date();
  next();
});

module.exports = mongoose.model('Transcripts', Transcript);
