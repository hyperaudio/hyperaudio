/*global haDash, Backbone, JST*/

haDash.Views = haDash.Views || {};

(function() {
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
      event.preventDefault();
      $('#passwordFormError').hide();

      $(event.target)
        .find('img')
        .show();

      $.ajax({
        url: haDash.API + '/accounts/reset',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        method: 'post',
        data: JSON.stringify({
          email: $('#email').val()
        })
      })
        .done(function(data) {
          //console.log(whoami);
          if (data.error) {
            var el = $('#' + data.error);
            if (el.length > 0) {
              el.show();
            } else {
              var ee = $('<pre></pre>').text(e.stack);
              $('#genericError')
                .show()
                .text('Server Error: ' + e.message)
                .append(ee);
            }
          } else {
            $('#send').hide();
            $('#passwordFormConfirm').show();
          }
        })
        .fail(function(e) {
          var ee = $('<pre></pre>').text(e.stack);
          $('#genericError')
            .show()
            .text('Server Error: ' + e.message)
            .append(ee);
          // $('#passwordFormError').show();
          $(event.target)
            .find('img')
            .hide();
        });
    }
  });
})();
