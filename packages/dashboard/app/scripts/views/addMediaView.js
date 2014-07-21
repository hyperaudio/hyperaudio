/*global haDash, Backbone, JST*/

haDash.Views = haDash.Views || {};

(function () {
    'use strict';

    haDash.Views.AddMediaView = Backbone.View.extend({

    id: 'addMediaView',

        template: JST['app/scripts/templates/addMedia.ejs'],

    initialize: function() {
      // this.listenTo(this.model, 'change', this.render);
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));

      // this.$el.foundation('reveal', 'open');

      return this;
    },

    events: {
      "click button": "addVideo"
    },

    //https://gist.github.com/takien/4077195
    YouTubeGetID: function (url){
      var ID = '';
      url = url.replace(/(>|<)/gi,'').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
      if(url[2] !== undefined) {
        ID = url[2].split(/[^0-9a-z_-]/i);
        ID = ID[0];
      }
      else {
        ID = null;
      }
      return ID;
    },

    addVideo: function() {
      if (!haDash.user) {
        haDash.router.navigate("secret-signin/", {trigger: true});
        this.remove();
      }

      var url = this.$el.find('input').val();
      var ytID = this.YouTubeGetID(url);


      var model = this.model;
      var view = this;

      if (ytID) {
        $.ajax({
          url: "http://gdata.youtube.com/feeds/api/videos/" + ytID + "?v=2&alt=json",
          success: function(ytData) {
            console.log(ytData);

            //clean yt json
            var cleanYtData = {};

            function ytClone(destination, source) {
              for (var property in source) {
                var prop = property.replace(/\$/g, '_');
                if (typeof source[property] === "object" &&
                 source[property] !== null ) {
                  destination[prop] = destination[prop] || {};
                  ytClone(destination[prop], source[property]);
                } else {
                  destination[prop] = source[property];
                }
              }
              return destination;
            };

            ytClone(cleanYtData, ytData);

            // model.set('created', haDash.user);
            model.set('owner', haDash.user);

            var title = ytData.entry.title["$t"];
            if (!title || title == "") {
              title = "Untitled";
            }
            model.set('label', title);


            model.set('desc', ytData.entry["media$group"]["media$description"]["$t"]);
            model.set('meta', {
              "youtube": cleanYtData
            });
            model.set('source', {
              "youtube": {
                    "type": "video/youtube",
                    "url": "http://www.youtube.com/watch?v=" + ytID,
                    "thumbnail": ytData.entry["media$group"]["media$thumbnail"][0].url
               }
            });

            console.log(model);

            haDash.mediaListView.collection.add(model);

            model.save(null, {
              success: function() {
                haDash.router.navigate("media/", {trigger: true});
                view.remove();
              }
            });

          },
          error: function(ytData) {
            alert('YouTube API threw an error, the video might not exist, or it is private');
          }
        });
      } else if (url.toLowerCase().indexOf('archive.org') >= 0) {
        console.log('IA detected, trying magic.');
        //var curl = 'http://www.corsproxy.com/' + url.replace('http://', '').replace('https://', '');
        var curl = 'http://cors.hyperaudio.net/proxy.php?csurl=' + urlencode(url);
        $.get(curl, function (page) {

          var title = $(page).filter('meta[property="og:title"]').attr('content');
          var desc = $(page).filter('meta[property="og:description"]').attr('content');
          var thumb = $(page).filter('meta[property="og:image"]').attr('content').replace('https://', 'http://');;
          var video0 = $(page).filter('meta[property="og:video"]').attr('content');
          var ext0 = video0.split('.').pop();

          model.set('owner', haDash.user);
          model.set('label', title);
          model.set('desc', desc);
          model.set('meta', {});

          var source = {};

          if (video0 && ext0) {
            source[ext0] = {
              url: video0
            };
            if (thumb) source[ext0].thumbnail = thumb;
            if (ext0 != 'mp4') {
              source.mp4 = {
                url: video0.replace('.' + ext0, '.mp4'),
                thumbnail: thumb
              };
            }
          } else {
            source.unknown = {
              url: url
            }
          }

          model.set('source', source);

          console.log(model);

          haDash.mediaListView.collection.add(model);

          model.save(null, {
            success: function() {
              haDash.router.navigate("media/", {trigger: true});
              view.remove();
            }
          });
          ////
        });
      } else {
        if (confirm('Cannot recognise this URL as an YouTube Video; choose [cancel] to abort or [ok] to continue')) {

          // non YT, hope for the best
          model.set('owner', haDash.user);
          model.set('label', 'n/a');
          model.set('label', 'n/a');
          model.set('desc', url);
          model.set('meta', {});
          model.set('source', {
            "unknown": {
              "url": url
            }
          });

          console.log(model);

          haDash.mediaListView.collection.add(model);

          model.save(null, {
            success: function() {
              haDash.router.navigate("media/", {trigger: true});
              view.remove();
            }
          });
        }

      }
    }

    });

})();

/*
          label: "Empty",
          desc: "no content",
          type: "text",
          // sort: 0,
          owner: null,
          meta: {},
          transcripts: []
*/
