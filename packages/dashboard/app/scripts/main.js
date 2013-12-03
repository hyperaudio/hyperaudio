/*global haDash, $*/


window.haDash = {
	API: (document.location.host == '10.0.54.74') ? 'http://10.0.54.74' : 'http://data.hyperaud.io', //FIXME
	Models: {},
	Collections: {},
	Views: {},
	Routers: {},

	init: function() {
		'use strict';

		this.router = new this.Routers.Router();

		Backbone.history.start({
			pushState: true
		});

		this.whoami();
	},

	user: null,

	whoami: function(callback) {

		$.ajax({
			url: this.API + '/whoami',
			xhrFields: {
				withCredentials: true
			},
			success: function(whoami) {
				console.log(whoami);

				if (whoami.user) {
					window.haDash.user = whoami.user;
				} else {
					window.haDash.user = null;
				}

				if (callback) callback();
			}
		});

	}
};

$(document).ready(function() {
	'use strict';

	haDash.init();
});
