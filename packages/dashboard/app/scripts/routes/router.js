/*global haDash, Backbone*/

haDash.Routers = haDash.Routers || {};

(function() {
  'use strict';

  var $main = $('#main');

  haDash.Routers.Router = Backbone.Router.extend({
    routes: {
      '': 'dashboard',
      'dashboard/': 'dashboard',
      'mixes/': 'mixes',
      'media/': 'media',
      'media/:id': 'mediaDetail',
      'secret-signin/': 'signin',
      'signout/': 'signout',
      'secret-signup/': 'signup',
      'add-media/': 'addMedia'
    },

    addMedia: function() {
      console.log('ADD MEDIA');
      $main.empty().append(
        new haDash.Views.AddMediaView({
          model: new haDash.Models.MediaModel()
        }).render().el
      );
    },

    dashboard: function() {
      // console.log('Dashboard N/A');
      document.location = '/media/';
    },

    mixes: function() {
      if (!haDash.mixCollection) {
        haDash.mixCollection = new haDash.Collections.MixCollection();
      }

      haDash.mixListView = new haDash.Views.MixListView({
        collection: haDash.mixCollection
      });

      $main.empty().append(haDash.mixListView.render().el);
      haDash.mixCollection.fetch();
    },

    media: function() {
      console.log('MEDIA');

      if (!haDash.mediaCollection) {
        haDash.mediaCollection = new haDash.Collections.MediaCollection();
      }

      // if (!haDash.mediaListView) {
        haDash.mediaListView = new haDash.Views.MediaListView({
          collection: haDash.mediaCollection
        });
      // }
      $main.empty().append(haDash.mediaListView.render().el);
      haDash.mediaCollection.fetch();

    },

    mediaDetail: function(id) {
      var model = new haDash.Models.MediaModel({_id: id});
      model.fetch({
        url: haDash.API + '/media/' + id
      });

      $main.empty().append(
        new haDash.Views.MediaDetailView({
          model: model
        }).render().el
      );
    },

    signin: function() {
      $main.empty().append(new haDash.Views.SignInView({}).el);
    },

    signout: function() {

      $.ajax({
        url: haDash.API + '/logout',
        contentType: "application/json; charset=utf-8",
          dataType: "json",
        xhrFields: {
          withCredentials: true
        },
        method: 'post',
        data: JSON.stringify({
          _csfr: 'TODO'
        }),
        success: function() {
              haDash.whoami(function() {
                haDash.router.navigate("mixes/", {trigger: true});
              });
        }
      });

    },

    signup: function() {
      $main.empty().append(new haDash.Views.SignUpView({}).el);
    }

  });

})();
