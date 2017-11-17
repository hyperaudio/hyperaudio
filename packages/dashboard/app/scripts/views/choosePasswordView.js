/*global haDash, Backbone, JST*/

haDash.Views = haDash.Views || {};

(function() {
  'use strict';
  haDash.Views.ChoosePasswordView = Backbone.View.extend({
    id: 'passwordView',
    template: JST['app/scripts/templates/choosePassword.ejs'],

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
        $(event.target)
          .find('img')
          .show();

        $.ajax({
          url: haDash.API + '/accounts/password',
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          xhrFields: {
            withCredentials: true
          },
          method: 'put',
          data: JSON.stringify({
            password: $('#password').val()
          })
        })
          .done(function(data) {
            /*console.log(whoami);
          $('#passwordForm').hide();
          $('#passwordFormConfirm').show();*/
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
              window.location = '/media/';
            }
          })
          .fail(function(e) {
            // $('#passwordFormError').show();
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
        $('#passwordFormError').show();
      }
    }
  });
})();
