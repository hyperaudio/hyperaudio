var application = require('application');

module.exports = Backbone.Router.extend({
  routes: {
    '': 'home',
    'login': 'login',
    'register': 'register',
    'media': 'media',
    'transcripts': 'transcripts',
    'mixes': 'mixes' 
  },

  home: function() {
    $('#main').html(application.homeView.render().el);
  },
  
  login: function() {
    $('#main').html(application.loginView.render().el);
  },
  
  register: function() {
    $('#main').html(application.registerView.render().el);
  },
  
  media: function() {
    $('#main').html(application.mediaView.render().el);
    
    $('#upload').click(function(){
      filepicker.pick(function(InkBlob){
        console.log(InkBlob.url);
      });
    });
  },
  
  transcripts: function() {
    $('#main').html(application.transcriptsView.render().el);
  },
  
  mixes: function() {
    $('#main').html(application.mixesView.render().el);
  }  
  
});
