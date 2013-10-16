var Transcript = require('models/transcriptObject');

module.exports = Backbone.Collection.extend({
	model: 	Transcript,
  url: function() {
      return window.API + '/transcripts';
  },
	
	initialize: function() {
		console.log('init transcripts');
	}
});
