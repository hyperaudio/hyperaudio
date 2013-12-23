var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var MediaObject = new mongoose.Schema({
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
  // probe: Schema.Types.Mixed,
  source: Schema.Types.Mixed,
  transcripts: [{
    type: Schema.Types.ObjectId,
    ref: 'Transcripts'
  }]
}, {
  versionKey: false
});

MediaObject.pre('save', function(next) {
  this.modified = new Date();
  next();
});

module.exports = mongoose.model('Media', MediaObject);
