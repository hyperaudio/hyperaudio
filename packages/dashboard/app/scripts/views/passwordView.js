/*global haDash, Backbone, JST*/

haDash.Views = haDash.Views || {};

(function () {
    'use strict';

    haDash.Views.PasswordView = Backbone.View.extend({

    id: 'passwordView',

        template: JST['app/scripts/templates/password.ejs'],

    initialize: function() {
      this.render();
    },

    render: function() {
      this.$el.html(this.template());

      return this;
    },

    events: {
      'click #passwordForm button[type="submit"]': 'send'
    },

    send: function(event) {
      event.preventDefault();
      $('#passwordFormError').hide();
      $(event.target).find('img').show();

      $.ajax({
        url: haDash.API + '/password',
        contentType: "application/json; charset=utf-8",
          dataType: "json",
        xhrFields: {
          withCredentials: true
        },
        method: 'post',
        data: JSON.stringify({
          email: $('#email').val(),
        })
      })
      .done(function(whoami) {
        console.log(whoami);
        $('#passwordForm').hide();
        $('#passwordConfirm').show();
      })
      .fail(function() {
        $('#passwordFormError').show();
        $(event.target).find('img').hide();
      });

    }

  });

})();
