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
        this.$el.html(this.template(this.model.toJSON()));

        // var mediaIDs = [];//this.model.get('transcripts');
        // var mediaCollection = new haDash.Collections.MediaCollection();

        var _this = this;

        $($.parseHTML(this.model.get('content'))).find('[data-id]').each(
          function(i,e){
            var mediaID = $(e).attr('data-id');
            var text = $(e).text();
            var mediaModel = new haDash.Models.MediaModel({_id: mediaID});
            mediaModel.fetch({
              url: haDash.API + '/media/' + mediaID
            });

            var mediaView = new haDash.Views.MediaView({
              model: mediaModel,
              success: function() {
                mediaModel.set('desc', text)
              }
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
        "click button.delete": "delete"
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
        this.model.destroy({
          url: haDash.API + '/mixes/' + this.model.id
        });
        haDash.router.navigate("/mixes/", {trigger: true});
      }

    });

})();
