var MediaObject = require('models/mediaObject');

module.exports = Backbone.Collection.extend({
	model: 	MediaObject,
  url: function() {
      return window.API + '/media';
  },
	
	initialize: function() {
		console.log('init mediaObjects');
	}
});
