var application = require('application');

$(function() {
  application.initialize();
  Backbone.history.start();
  application.whoami();
});
