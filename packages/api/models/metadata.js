var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Metadata = new mongoose.Schema({
	any: Schema.Types.Mixed
}, {
  versionKey: false,
  _id: false
});

module.exports = mongoose.model('Metadata', Metadata);
