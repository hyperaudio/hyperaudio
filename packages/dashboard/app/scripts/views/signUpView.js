/*global haDash, Backbone, JST*/

haDash.Views = haDash.Views || {};

(function () {
    'use strict';

    haDash.Views.SignUpView = Backbone.View.extend({

		el: '#main',

        template: JST['app/scripts/templates/signUp.ejs'],

		initialize: function() {
			this.render();
		},

		render: function() {
			this.$el.html(this.template());

			return this;
		},

		events: {
			'click #registerForm input[type="submit"]': 'signup'
		},

		signup: function(event) {
			event.preventDefault();
			$('#registerFormError').hide();

			$.ajax({
				url: haDash.API + '/register',
				xhrFields: {
					withCredentials: true
				},
				method: 'post',
				data: {
			        username: $('#username').val(),
			        password: $('#password').val()
			    }
			})
			.done(function(whoami) {
				console.log(whoami);
				//FIXME in API login person directly
				haDash.router.navigate("secret-signin/", {trigger: true});
				alert('Marvelous, now please log in');
		    //     haDash.whoami(function() {
		    //       if (haDash.user) {
					 //  haDash.router.navigate("mixes/", {trigger: true});
				  // } else {
					 //  alert('Invalid Registration');
				  // }
		    //     });
		    })
		    .fail(function() {
		      	// alert( "Registration Error" );
		      	$('#registerFormError').show();
		    });

		}

    });

})();
