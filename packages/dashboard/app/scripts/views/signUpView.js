/*global haDash, Backbone, JST*/

haDash.Views = haDash.Views || {};

(function () {
    'use strict';

    haDash.Views.SignUpView = Backbone.View.extend({

    id: 'signUpView',

        template: JST['app/scripts/templates/signUp.ejs'],

    initialize: function() {
      this.render();
    },

    render: function() {
      this.$el.html(this.template());

      return this;
    },

    events: {
      'click #registerForm button[type="submit"]': 'signup'
    },

    signup: function(event) {
      event.preventDefault();
      $('.form-alert').hide();
      $(event.target).find('img').show();

      if($('#accept').attr('checked')) {

        $.ajax({
          url: haDash.API + '/register',
          contentType: "application/json; charset=utf-8",
            dataType: "json",
          xhrFields: {
            withCredentials: true
          },
          method: 'post',
          data: JSON.stringify({
                username: $('#username').val(),
                password: $('#password').val(),
                email: $('#email').val(),
            })
        })
        .done(function(whoami) {
          haDash.router.navigate("signin/", {trigger: true});
        })
        .fail(function(e) {

          if (e.status == "401") {
            $('#registerUsernameError').show();
          }

          if (e.status == "409") {
            $('#registerEmailError').show();
          }
          
          $(event.target).find('img').hide();
        });
        
      } else {
        $('#registerTermsError').show();
      }
    }
  });
})();
