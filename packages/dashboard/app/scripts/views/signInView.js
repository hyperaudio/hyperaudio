/*global haDash, Backbone, JST*/

haDash.Views = haDash.Views || {};

(function () {
    'use strict';

    haDash.Views.SignInView = Backbone.View.extend({
		
		el: '#main',

        template: JST['app/scripts/templates/signIn.ejs'],
		
		initialize: function() {
			this.render();
		},
		
		render: function() {
			this.$el.html(this.template());

			return this;
		},
		
		events: {
			'click input[type="submit"]': 'signin'
		},
		
		signin: function(event) {
			event.preventDefault();
			
			$.ajax({
				url: haDash.API + '/login',
				xhrFields: {
					withCredentials: true
				},
				method: 'post',
				data: {
			        username: $('#username').val(),
			        password: $('#password').val()
			    }
			})
			.done(function() {
		        haDash.whoami(function() {
		          if (haDash.user) {
					  haDash.router.navigate("mixes/", {trigger: true});
				  } else {
					  alert('Invalid Login');
				  }
		        });
		    })
		    .fail(function() {
		      	alert( "Login Error" );
		    });
					
		}
    });

})();
