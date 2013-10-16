var application = require('application');

module.exports = Backbone.Router.extend({
  routes: {
    '': 'home',
    'login': 'login'
  },

  home: function() {
    $('#main').html(application.homeView.render().el);
  },
  
  login: function() {
  }
});
