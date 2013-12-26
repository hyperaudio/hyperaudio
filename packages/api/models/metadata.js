var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Metadata = new mongoose.Schema({
	_id: String//,
  // youtube: {
  //   type: Schema.Types.Mixed,
  //   default: null
  // },
  // download: {
  //   type: Schema.Types.Mixed,
  //   default: null
  // },
  // probe: {
  //   type: Schema.Types.Mixed,
  //   default: null
  // }
}, {
  versionKey: true,
  strict: false,
  collection: 'metadata'
});

module.exports = mongoose.model('Metadata', Metadata);
