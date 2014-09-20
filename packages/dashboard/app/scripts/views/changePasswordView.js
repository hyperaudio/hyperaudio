/*global haDash, Backbone, JST*/

haDash.Views = haDash.Views || {};


(function () {
    'use strict';

    haDash.Views.ChangePasswordView = Backbone.View.extend({

    id: 'passwordView',

        template: JST['app/scripts/templates/changePassword.ejs'],

    initialize: function() {
      this.render();
    },

    render: function() {
      this.$el.html(this.template());

      return this;
    },

    events: {
      'click #passwordForm button[type="submit"]': 'change'
    },

    change: function(event) {
      event.preventDefault();
      $('#passwordFormError').hide();

      if ($('#password').val() == $('#password2').val()) {
        $(event.target).find('img').show();

        $.ajax({
          url: haDash.API + '/change-password',
          contentType: "application/json; charset=utf-8",
            dataType: "json",
          xhrFields: {
            withCredentials: true
          },
          method: 'post',
          data: JSON.stringify({
            password: $('#password').val()
          })
        })
        .done(function(whoami) {
          console.log(whoami);
          $('#passwordForm').hide();
          $('#passwordFormConfirm').show();
        })
        .fail(function() {
          $('#passwordFormError').show();
          $(event.target).find('img').hide();
        });

      } else {
        $('#passwordFormError').show();
      }

    }

  });

})();
