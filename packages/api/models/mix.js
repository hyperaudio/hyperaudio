var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Mix = new mongoose.Schema({
    label:  String,
    desc: String,
    type: String,
    // sort: { type: Number },
    owner: String,
    meta: Schema.Types.Mixed,
	created: { type: Date, default: Date.now },
	modified: { type: Date, default: Date.now },
    content: String
}, { versionKey: false });

Mix.pre('save', function (next) {
	this.modified = new Date();
    next();
});

module.exports = mongoose.model('Mixes', Mix);