var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Metadata = new mongoose.Schema({
	_id: String,
  youtube: {
    type: Schema.Types.Mixed,
    default: null
  },
  download: {
    type: Schema.Types.Mixed,
    default: null
  },
  probe: {
    type: Schema.Types.Mixed,
    default: null
  },
  video: {
    type: Schema.Types.Mixed,
    default: null
  },
  audio: {
    type: Schema.Types.Mixed,
    default: null
  },
  m4a: {
    type: Schema.Types.Mixed,
    default: null
  }
}, {
  versionKey: false,
  // strict: false,
  collection: 'metadata'
});

module.exports = mongoose.model('Metadata', Metadata);
