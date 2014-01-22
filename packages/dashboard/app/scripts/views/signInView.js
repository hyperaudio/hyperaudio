/*global haDash, Backbone, JST*/

haDash.Views = haDash.Views || {};

(function () {
  'use strict';

  haDash.Views.SignInView = Backbone.View.extend({

    id: 'signInView',

        template: JST['app/scripts/templates/signIn.ejs'],

    initialize: function() {
      this.render();
    },

    render: function() {
      this.$el.html(this.template());

      return this;
    },

    events: {
      'click #loginForm button[type="submit"]': 'signin'
    },

    signin: function(event) {
      event.preventDefault();
      $('#loginFormError').hide();
      $(event.target).find('img').show();

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
        haDash.setUser(whoami);
        if (whoami.user) {
          haDash.router.navigate("mixes/", {trigger: true});
        }
      })
      .fail(function() {
        $('#loginFormError').show();
        $(event.target).find('img').hide();
      });

    }
  });

})();
