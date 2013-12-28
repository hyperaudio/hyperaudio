/*global haDash, Backbone*/

haDash.Routers = haDash.Routers || {};

(function() {
	'use strict';

	var $main = $('#main');

	haDash.Routers.Router = Backbone.Router.extend({
		routes: {
			'': 'dashboard',
			'mixes/': 'mixes',
			'media/': 'media',
			'media/:id': 'mediaObject',
			'secret-signin/': 'signin',
			'signout/': 'signout',
			'secret-signup/': 'signup',
			'add-media/': 'addMedia'
		},

		addMedia: function() {
			console.log('ADD MEDIA');
			$main.empty().append(
				new haDash.Views.AddMediaView({
					model: new haDash.Models.MediaModel()
				}).render().el
			);
		},

		dashboard: function() {
			console.log('Dashboard N/A');
			//TODO redirect to /
		},

		mixes: function() {
			haDash.mixListView = new haDash.Views.MixListView({
				collection: new haDash.Collections.MixCollection()
			});
		},

		media: function() {
			console.log('MEDIA');

			if (!haDash.mediaCollection) {
				haDash.mediaCollection = new haDash.Collections.MediaCollection();
			}

			// if (!haDash.mediaListView) {
				haDash.mediaListView = new haDash.Views.MediaListView({
					collection: haDash.mediaCollection
				});
			// }
			$main.empty().append(haDash.mediaListView.render().el);
			haDash.mediaCollection.fetch();

		},

		mediaObject: function(id) {
			//FIXME populate collection before?

			$main.empty().append(
				new haDash.Views.MediaPreviewView({
					model: haDash.mediaCollection.get(id)
				}).render().el
			);
		},

		signin: function() {
			haDash.signInView = new haDash.Views.SignInView({});
		},

		signout: function() {

			$.ajax({
				url: haDash.API + '/logout',
				contentType: "application/json; charset=utf-8",
    			dataType: "json",
				xhrFields: {
					withCredentials: true
				},
				method: 'post',
				data: JSON.stringify({
					_csfr: 'TODO'
				}),
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
