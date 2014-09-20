/*global haDash, Backbone, JST*/

haDash.Views = haDash.Views || {};

function validEmail(email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
} 

(function () {
    'use strict';

    haDash.Views.ResetPasswordView = Backbone.View.extend({

    id: 'passwordView',

        template: JST['app/scripts/templates/resetPassword.ejs'],

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
      console.log("sending");
      event.preventDefault();
      $('#passwordFormError').hide();

      if (validEmail($('#email').val())) {
        console.log($('#email').val());
        $(event.target).find('img').show();

        $.ajax({
          url: haDash.API + '/reset-password',
          contentType: "application/json; charset=utf-8",
            dataType: "json",
          xhrFields: {
            withCredentials: true
          },
          method: 'post',
          data: JSON.stringify({
            email: 'mark@hyperaud.io'
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

      } else {
        $('#passwordFormError').show();
      }

    }

  });

})();
