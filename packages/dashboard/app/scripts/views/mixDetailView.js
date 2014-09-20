/*global haDash, Backbone, JST*/

haDash.Views = haDash.Views || {};

(function () {
    'use strict';

    haDash.Views.MixDetailView = Backbone.View.extend({

      id: 'mixDetail',

      template: JST['app/scripts/templates/mixDetail.ejs'],

      initialize: function() {
        this.listenTo(this.model, 'change', this.render);
      },

      render: function() {
        document.title = "Hyperaudio: " + this.model.get('label');

        this.$el.html(this.template(this.model.toJSON()));

        this.$el.find('.tags').select2({
          tags:[],
          tokenSeparators: [","]
        });

        if (this.notMutable()) {
          this.$el.find('.tags').select2("readonly", true);
        }

        this.$el.find('.channels').select2({
          maximumSelectionSize: 1,
          tags:[],
          tokenSeparators: [","]
        });

        if (this.notMutable()) {
          this.$el.find('.channels').select2("readonly", true);
        }

        // var mediaIDs = [];//this.model.get('transcripts');
        // var mediaCollection = new haDash.Collections.MediaCollection();

        var _this = this;

        $($.parseHTML(this.model.get('content'))).find('[data-id]').each(
          function(i,e){
            var mediaID = $(e).attr('data-id');
            var text = $(e).text();
            var mediaModel = new haDash.Models.MediaModel({_id: mediaID});
            mediaModel.fetch({
              url: haDash.API + '/media/' + mediaID,
              success: function() {
                console.log(text);
                mediaModel.set({desc: text});
              }
            });

            var mediaView = new haDash.Views.MediaView({
              model: mediaModel
            });

            _this.$el.find('tbody').append(mediaView.render().el);
          }
        );

        // for (var i = 0; i < mediaIDs.length; i++) {
        //   var mediaID = mediaIDs[i];

        //   var mediaModel = new haDash.Models.MediaModel({_id: mediaID});
        //   mediaModel.fetch({
        //     url: haDash.API + '/media/' + mediaID
        //   });

        //   var mediaView = new haDash.Views.MediaView({
        //     model: mediaModel
        //   });

        //   this.$el.find('tbody').append(mediaView.render().el);
        // }


        this.$el.data('view', this);
        this.$el.data('model', this.model);
        return this;
      },

      events: {
        "click h2.label, p.desc": "edit",
        "blur h2.label, p.desc": "save",
        "click button.delete": "delete",
        "change .tags": "saveTags",
        "change .channels": "saveChannels"
      },

      notMutable: function() {
        return this.model.get('owner') != haDash.user;
      },

      edit: function(event) {
        if (this.notMutable()) return;
        $(event.target).attr('contenteditable', true).trigger('focus');
      },

      save: function(event) {
        if (this.notMutable()) return;
        $(event.target).attr('contenteditable', false);
        this.model.set($(event.target).data('field'), $(event.target).text().trim());
        this.model.save(null, {
          url: haDash.API + '/mixes/' + this.model.id
        });
      },

      delete: function() {
        if (this.notMutable()) return;

        if (!confirm('Are you sure you wish to delete this mix?')) return;

        this.model.destroy({
          url: haDash.API + '/mixes/' + this.model.id
        });
        haDash.router.navigate("/mixes/", {trigger: true});
      },

      saveTags: function() {
        if (this.notMutable()) return;
        this.model.set('tags', this.$el.find('.tags').select2("val"));
        this.model.save(null, {
          url: haDash.API + '/mixes/' + this.model.id
        });
      },

      saveChannels: function() {
        if (this.notMutable()) return;
        this.model.set('channel', this.$el.find('.channels').select2("val")[0]);
        this.model.save(null, {
          url: haDash.API + '/mixes/' + this.model.id
        });
      }

    });

})();
