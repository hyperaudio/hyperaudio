var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Mix = new mongoose.Schema({
  _id: String,
  label: String,
  desc: String,
  type: String,
  owner: String,
  namespace: String,
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
  tags: [String],
  channel: String
}, {
  versionKey: false,
  collection: 'mixes'
});

Mix.pre('save', function(next) {
  this.modified = new Date();
  next();
});

module.exports = mongoose.model('Mixes', Mix);
