var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MediaObject = new mongoose.Schema({
    label:  String,
    desc: String,
    type: String,
    sort: { type: Number },
    owner: String,
    meta: Schema.Types.Mixed
});

module.exports = mongoose.model('Media', MediaObject);