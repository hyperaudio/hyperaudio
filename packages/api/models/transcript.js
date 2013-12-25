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
    type: Schema.Types.ObjectId,
    ref: 'Media'
  } //,
  // alignments: Schema.Types.Mixed
}, {
  versionKey: false,
  _id: false
});

Transcript.pre('save', function(next) {
  this.modified = new Date();
  next();
});

module.exports = mongoose.model('Transcripts', Transcript);
