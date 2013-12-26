var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Metadata = new mongoose.Schema({
	_id: String,
  youtube: Schema.Types.Mixed,
  download: Schema.Types.Mixed,
  probe: Schema.Types.Mixed
}, {
  versionKey: true,
  collection: 'metadata'
});

module.exports = mongoose.model('Metadata', Metadata);
