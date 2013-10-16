// Application bootstrapper.
Application = {
  initialize: function() {
    var HomeView = require('views/home_view');
    var Router = require('lib/router');
    this.homeView = new HomeView();
    this.router = new Router();
    if (typeof Object.freeze === 'function') Object.freeze(this);
  },
  
  user: null,
  
  whoami: function() {
    $.get('https://10.0.54.74/whoami', function(whoami) {
      console.log(whoami);
      if (whoami.user) {
        this.user = whoami.user;
        $('body').removeClass('anonymous').addClass('user');
        $('#userName').text(this.user.username);
      } else {
        this.user = null;
        $('body').removeClass('user').addClass('anonymous');
        $('#userName').text('Account');
      }
    });
  }
}

module.exports = Application;
