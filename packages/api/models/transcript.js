var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Transcript = new mongoose.Schema({
    label:  String,
    desc: String,
    type: String,
    sort: { type: Number },
    owner: String,
    meta: Schema.Types.Mixed,
    content: String,
    media: { type: Schema.Types.ObjectId, ref: 'Media' },
	alignments: Schema.Types.Mixed
});

module.exports = mongoose.model('Transcripts', Transcript);