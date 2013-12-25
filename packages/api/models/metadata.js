var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Metadata = new mongoose.Schema({
	_id: String
}, {
  versionKey: false,
  strict: false
});

module.exports = mongoose.model('Metadata', Metadata);
