/*global haDash, Backbone, JST*/

haDash.Views = haDash.Views || {};

(function() {
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

      if ($('#accept').is(':checked')) {
        $(event.target)
          .find('img')
          .show();

        $.ajax({
          url: haDash.API + '/accounts/register',
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          method: 'post',
          data: JSON.stringify({
            username: $('#username').val(),
            password: $('#password').val(),
            email: $('#email').val()
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
              $(event.target)
                .find('img')
                .hide();
              $('#signup').hide();
              $('#registerCheckMail').show();
            }
          })
          .fail(function(e) {
            var ee = $('<pre></pre>').text(e.stack);
            $('#genericError')
              .show()
              .text('Server Error: ' + e.message)
              .append(ee);
            $(event.target)
              .find('img')
              .hide();
          });
      } else {
        $('#registerTermsError').show();
      }
    }
  });
})();
