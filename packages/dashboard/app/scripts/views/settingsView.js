/*global haDash, Backbone, JST*/

haDash.Views = haDash.Views || {};

(function() {
  'use strict';
  haDash.Views.SettingsView = Backbone.View.extend({
    id: 'settingsView',
    template: JST['app/scripts/templates/settings.ejs'],

    initialize: function() {
      this.render();
    },

    render: function() {
      this.$el.html(this.template());
      return this;
    },

    events: {
      'click #emailForm button[type="submit"]': 'change',
      'click #deleteAccountForm button[type="submit"]': 'delete'
    },

    change: function(event) {
      event.preventDefault();
      $('.form-alert').hide();

      $(event.target)
        .find('img')
        .show();

      $.ajax({
        url: haDash.API + '/accounts/email',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        method: 'put',
        data: JSON.stringify({
          email: $('#email').val(),
          password: $('#password-change').val()
        })
      })
        .done(function(data) {
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
            $('#passwordForm').hide();
            $('#passwordFormConfirm').show();
          }
        })
        .fail(function(e) {
          var ee = $('<pre></pre>').text(e.stack);
          $('#genericError')
            .show()
            .text('Server Error: ' + e.message)
            .append(ee);
          // $('#changeEmailError').show();
          $(event.target)
            .find('img')
            .hide();
        });
    }
  });
})();
