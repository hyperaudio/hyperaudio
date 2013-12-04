/*global haDash, Backbone*/

haDash.Routers = haDash.Routers || {};

(function() {
	'use strict';

	haDash.Routers.Router = Backbone.Router.extend({
		routes: {
			'': 'dashboard',
			'mixes/': 'mixes',
			'media/': 'media',
			'secret-signin/': 'signin',
			'signout/': 'signout',
			'secret-signup/': 'signup'
		},

		dashboard: function() {
			console.log('Dashboard N/A');
			//TODO redirect to /
		},

		mixes: function() {
			console.log('mixes');
			haDash.mixListView = new haDash.Views.MixListView({
				collection: new haDash.Collections.MixCollection()
			});
		},

		media: function() {
			console.log('media');
			haDash.mediaListView = new haDash.Views.MediaListView({
				collection: new haDash.Collections.MediaCollection()
			});
		},
		
		signin: function() {
			haDash.signInView = new haDash.Views.SignInView({});
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
			haDash.signUpView = new haDash.Views.SignUpView({});
		}

	});

})();
