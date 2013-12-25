var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var MediaObject = new mongoose.Schema({
  label: String,
  desc: String,
  type: String,
  owner: String,
  meta: {
    type: Schema.Types.ObjectId,
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
  source: Schema.Types.Mixed,
  transcripts: [{
    type: Schema.Types.ObjectId,
    ref: 'Transcripts'
  }]
}, {
  versionKey: false,
  _id: false
});

MediaObject.pre('save', function(next) {
  this.modified = new Date();
  next();
});

module.exports = mongoose.model('Media', MediaObject);
