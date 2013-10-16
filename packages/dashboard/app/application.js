
window.API = (document.location.host == '10.0.54.74')?'https://10.0.54.74':'https://data.hyperaud.io';
// window.API = 'https://data.hyperaud.io';


$.fn.editable.defaults.mode = 'inline';


// Application bootstrapper.
Application = {
  
  initialize: function() {
    
    filepicker.setKey('A8RudJZ9NTTC8MTn61ia7z');
    
    var HomeView = require('views/home_view');

    var LoginView = require('views/login_view');
    var RegisterView = require('views/register_view');

    var MediaView = require('views/media_view');
    var TranscriptsView = require('views/transcripts_view');
    var MixesView = require('views/mixes_view');
    
    var Router = require('lib/router');
    
    this.homeView = new HomeView();

    this.loginView = new LoginView();
    this.registerView = new RegisterView();

    this.mediaView = new MediaView();
    this.transcriptsView = new TranscriptsView();
    this.mixesView = new MixesView();
    
    this.router = new Router();
    
    if (typeof Object.freeze === 'function') Object.freeze(this);
  },
  
  user: null,
  
  whoami: function() {
    $.get(window.API + '/whoami', function(whoami) {
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
