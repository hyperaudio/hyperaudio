/*global haDash, Backbone, JST*/

haDash.Views = haDash.Views || {};

(function () {
    'use strict';

    haDash.Views.SignInView = Backbone.View.extend({

		id: '#signInView',

        template: JST['app/scripts/templates/signIn.ejs'],

		initialize: function() {
			this.render();
		},

		render: function() {
			this.$el.html(this.template());

			return this;
		},

		events: {
			'click #loginForm input[type="submit"]': 'signin'
		},

		signin: function(event) {
			event.preventDefault();
			$('#loginFormError').hide();

			$.ajax({
				url: haDash.API + '/login',
				contentType: "application/json; charset=utf-8",
    			dataType: "json",
				xhrFields: {
					withCredentials: true
				},
				method: 'post',
				data: JSON.stringify({
			        username: $('#username').val(),
			        password: $('#password').val()
			    })
			})
			.done(function(whoami) {
				console.log(whoami);

				if (whoami.user) {
					window.haDash.user = whoami.user;
					$('body').removeClass('anonymous').addClass('user');
					haDash.router.navigate("mixes/", {trigger: true});
				} else {
					window.haDash.user = null;
					$('body').removeClass('user').addClass('anonymous');
				}
		    })
		    .fail(function() {
		      	// alert( "Invalid user and/or password" );
		      	$('#loginFormError').show();
		    });

		}
    });

})();
