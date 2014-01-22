/*global haDash, Backbone, JST*/

haDash.Views = haDash.Views || {};

(function () {
    'use strict';

    haDash.Views.MediaDetailView = Backbone.View.extend({

    id: 'mediaDetail',

        template: JST['app/scripts/templates/mediaDetail.ejs'],

    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));

      // var transcriptIDs = this.model.get('transcripts');
      var transcripts = new haDash.Collections.TranscriptCollection();

      // for (var i = 0; i < transcriptIDs.length; i++) {
      //   var transcriptID = transcriptIDs[i];
      //   var transcript = new haDash.Models.TranscriptModel({_id: transcriptID});
      //   transcript.fetch({
      //     url: haDash.API + '/transcripts/' + transcriptID
      //   });
      //   transcripts.add(transcript);
      // }

      this.$el.find('.tags').select2({
        tags:[],
        tokenSeparators: [",", " "]
      });
      if (this.notMutable()) {
        this.$el.find('.tags').select2("readonly", true);
      }

      this.$el.find("#transcripts").empty().append(
        new haDash.Views.TranscriptListView({
          collection: transcripts
        }).render().el
      );

      transcripts.fetch({
        url: haDash.API + '/media/' + this.model.id + '/transcripts'
      });

      this.$el.data('view', this);
      this.$el.data('model', this.model);
      return this;
    },

    events: {
      "click h2.label, p.desc": "edit",
      "blur h2.label, p.desc": "save",
      "click button.delete": "delete",
      "change .tags": "saveTags"
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
        url: haDash.API + '/media/' + this.model.id
      });
    },

    delete: function() {
      if (this.notMutable()) return;
      this.model.destroy({
        url: haDash.API + '/media/' + this.model.id
      });
      haDash.router.navigate("/media/", {trigger: true});
    },

    saveTags: function() {
      console.log('tag event');
    }

    });

})();

