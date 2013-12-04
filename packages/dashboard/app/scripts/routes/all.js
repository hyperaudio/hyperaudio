/*global haDash, Backbone*/

haDash.Routers = haDash.Routers || {};

(function() {
	'use strict';

	haDash.Routers.Router = Backbone.Router.extend({
		routes: {
			'': 'dashboard',
			'mixes/': 'mixes',
			'media/': 'media',
			'signin/': 'signin',
			'signout/': 'signout',
			'signup/': 'signup'
		},

		dashboard: function() {
			console.log('Dashboard N/A');
			//TODO redirect to /
		},

		mixes: function() {
			console.log('mixes');
			haDash.mixView = new haDash.Views.MixesView({
				collection: new haDash.Collections.MixCollection()
			});
		},

		media: function() {
			console.log('media');
		},
		
		signin: function() {
			haDash.signinView = new haDash.Views.SigninView({});
		},
		
		signout: function() {
			
			$.ajax({
				url: haDash.API + '/logout',
				xhrFields: {
					withCredentials: true
				},
				success: function() {
  			      haDash.whoami(function() {
  			        haDash.router.navigate("mixes/", {trigger: true});
  			      });
				}
			});

		},
		
		signup: function() {
			haDash.signupView = new haDash.Views.SignupView({});
		}

	});

})();
