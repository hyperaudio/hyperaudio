/*global haDash, Backbone, JST*/

haDash.Views = haDash.Views || {};

(function() {
  'use strict';

  haDash.Views.MediaDetailView = Backbone.View.extend({
    id: 'mediaDetail',

    template: JST['app/scripts/templates/mediaDetail.ejs'],

    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
    },

    render: function() {
      document.title = 'Hyperaudio: ' + this.model.get('label');

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
        // maximumSelectionSize: 1,
        tags: [],
        tokenSeparators: [',']
      });
      if (this.notMutable()) {
        // this.$el.find('.tags').select2("readonly", true);
      }

      this.$el.find('.channels').select2({
        maximumSelectionSize: 1,
        tags: [],
        tokenSeparators: [',']
      });
      if (this.notMutable()) {
        // this.$el.find('.channels').select2("readonly", true);
      }

      this.$el
        .find('#transcripts')
        .empty()
        .append(
          new haDash.Views.TranscriptListView({
            collection: transcripts
          }).render().el
        );

      transcripts.fetch({
        // url: haDash.API + '/media/' + this.model.id + '/transcripts'
        url: haDash.API + '/transcripts?media=' + this.model.id
      });

      this.$el.data('view', this);
      this.$el.data('model', this.model);
      return this;
    },

    events: {
      'click h2.label, p.desc': 'edit',
      'blur h2.label, p.desc': 'save',
      'click button.delete': 'delete',
      'change .tags': 'saveTags',
      'change .channels': 'saveChannels'
    },

    // refresh: function() {
    //   this.transcripts.fetch({
    //     url: haDash.API + '/media/' + this.model.id + '/transcripts'
    //   });
    // },

    notMutable: function() {
      return this.model.get('owner') != haDash.user;
    },

    edit: function(event) {
      if (this.notMutable()) return;
      $(event.target)
        .attr('contenteditable', true)
        .trigger('focus');
    },

    save: function(event) {
      if (this.notMutable()) return;
      $(event.target).attr('contenteditable', false);
      this.model.set(
        $(event.target).data('field'),
        $(event.target)
          .text()
          .trim()
      );
      this.model.save(null, {
        url: haDash.API + '/media/' + this.model.id
      });
    },

    delete: function() {
      if (this.notMutable()) return;

      if (!confirm('Are you sure you wish to delete this media entry?')) return;

      this.model.destroy({
        url: haDash.API + '/media/' + this.model.id,
        wait: true,
        success: function(model, response, options) {
          console.log(model, response, options);
          haDash.router.navigate('/media/', { trigger: true });
        },
        error: function(model, response, options) {
          console.log('error');
          console.log(model, response, options);
          haDash.router.navigate('/media/', { trigger: true });
        }
      });
    },

    saveTags: function() {
      if (this.notMutable()) return;
      this.model.set('tags', this.$el.find('.tags').select2('val'));
      this.model.save(null, {
        url: haDash.API + '/media/' + this.model.id
      });
    },

    saveChannels: function() {
      if (this.notMutable()) return;
      this.model.set('channel', this.$el.find('.channels').select2('val')[0]);
      this.model.save(null, {
        url: haDash.API + '/media/' + this.model.id
      });
    }
  });
})();
