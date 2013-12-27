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
			'secret-signup/': 'signup',
			'add-media/': 'addMedia'
		},

		addMedia: function() {
			new haDash.Views.AddMediaView({
				model: new haDash.Models.MediaModel()
			}).render();
		},

		dashboard: function() {
			console.log('Dashboard N/A');
			//TODO redirect to /
		},

		mixes: function() {
			// console.log('mixes');
			// haDash.whoami(function(){
				haDash.mixListView = new haDash.Views.MixListView({
					collection: new haDash.Collections.MixCollection()
				});
			// });
		},

		media: function() {
			// console.log('media');

			// haDash.whoami(function(){

				haDash.mediaListView = new haDash.Views.MediaListView({
					collection: new haDash.Collections.MediaCollection()
				});

				// setTimeout(applyTooltips, 500);//FIXME
			// });

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
