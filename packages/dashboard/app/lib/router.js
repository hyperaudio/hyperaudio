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
    
    var MediaObject = require('models/mediaObject');
    var MediaObjects = require('models/mediaObjects');

    var MediaObjectsView = require('views/mediaObjects_view');

    var mediaObjects = new MediaObjects();
    
    var mediaObjectsView = new MediaObjectsView({
      el: $('#mediaObjects'),
      collection: mediaObjects
    });
    
    mediaObjects.comparator = function(model) {
      return parseInt(model.get('sort'));
    };


    mediaObjects.fetch({reset: true});
    
    $('#upload').click(function(){
      filepicker.pick({
        services: ["COMPUTER", "VIDEO", "WEBCAM", "URL", "DROPBOX", "GOOGLE_DRIVE", "FACEBOOK", "GITHUB"]
      },
      function(InkBlob){
        // console.log(InkBlob.url);
        console.log(InkBlob);
        mediaObjects.create({
          '_id': null,  
          label: InkBlob.filename,
          desc: "",
          type: InkBlob.mimetype.split('/')[0],
          sort: 999,
          owner: null,
          meta: {
            filename: InkBlob.filename,
            mimetype: InkBlob.mimetype,
            size: InkBlob.size,
            url: InkBlob.url,
            key: InkBlob.key
          }
        }); //FIXME sort
        
        mediaObjects.trigger('reset');
      },
      function(err){
        //ERR
        console.log(err);
      });
    });
  },
  
  transcripts: function() {
    $('#main').html(application.transcriptsView.render().el);
    
    var TranscriptObject = require('models/transcriptObject');
    var TranscriptObjects = require('models/transcriptObjects');

    var TranscriptObjectsView = require('views/transcriptObjects_view');

    var transcriptObjects = new TranscriptObjects();
    
    var transcriptObjectsView = new TranscriptObjectsView({
      el: $('#transcriptObjects'),
      collection: transcriptObjects
    });
    
    transcriptObjects.comparator = function(model) {
      return parseInt(model.get('sort'));
    };


    transcriptObjects.fetch({reset: true});
    
    $('#upload').click(function(){
      filepicker.pick({
        services: ["COMPUTER", "VIDEO", "WEBCAM", "URL", "DROPBOX", "GOOGLE_DRIVE", "FACEBOOK", "GITHUB"]
      },
      function(InkBlob){
        // console.log(InkBlob.url);
        console.log(InkBlob);
        transcriptObjects.create({
          '_id': null,  
          label: InkBlob.filename,
          desc: "",
          type: InkBlob.mimetype.split('/')[0],
          sort: 999,
          owner: null,
          meta: {
            filename: InkBlob.filename,
            mimetype: InkBlob.mimetype,
            size: InkBlob.size,
            url: InkBlob.url,
            key: InkBlob.key
          }
        }); //FIXME sort
        
        transcriptObjects.trigger('reset');
      },
      function(err){
        //ERR
        console.log(err);
      });
    });
  },
  
  mixes: function() {
    $('#main').html(application.mixesView.render().el);
    
    var MixObject = require('models/mixObject');
    var MixObjects = require('models/mixObjects');

    var MixObjectsView = require('views/mixObjects_view');

    var mixObjects = new MixObjects();
    
    var mixObjectsView = new MixObjectsView({
      el: $('#mixObjects'),
      collection: mixObjects
    });
    
    mixObjects.comparator = function(model) {
      return parseInt(model.get('sort'));
    };


    mixObjects.fetch({reset: true});
    
    $('#upload').click(function(){
      filepicker.pick({
        services: ["COMPUTER", "VIDEO", "WEBCAM", "URL", "DROPBOX", "GOOGLE_DRIVE", "FACEBOOK", "GITHUB"]
      },
      function(InkBlob){
        // console.log(InkBlob.url);
        console.log(InkBlob);
        mixObjects.create({
          '_id': null,  
          label: InkBlob.filename,
          desc: "",
          type: InkBlob.mimetype.split('/')[0],
          sort: 999,
          owner: null,
          meta: {
            filename: InkBlob.filename,
            mimetype: InkBlob.mimetype,
            size: InkBlob.size,
            url: InkBlob.url,
            key: InkBlob.key
          }
        }); //FIXME sort
        
        mixObjects.trigger('reset');
      },
      function(err){
        //ERR
        console.log(err);
      });
    });
  }  
  
});
