var Mix = require('models/mixObject');

module.exports = Backbone.Collection.extend({
	model: 	Mix,
  url: function() {
      return window.API + '/mixes';
  },
	
	initialize: function() {
		console.log('init mixes');
	}
});
