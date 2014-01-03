/*global haDash, Backbone, JST*/

haDash.Views = haDash.Views || {};

(function () {
    'use strict';

    haDash.Views.TranscriptView = Backbone.View.extend({

        tagName: 'tr',

        template: JST['app/scripts/templates/transcript.ejs'],

    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.$el.find("span.timeago").timeago();

      this.$el.data('view', this);
      this.$el.data('model', this.model);
      return this;
    },

    events: {
      "click .tLabel, tDesc": "edit",
      "blur .tLabel, .tDesc": "save",
      "click .align": "align",
      "click .tDelete": "delete",
      "click .tClone": "clone"
    },

    notMutable: function() {
      return this.model.get('owner') != haDash.user;
    },

    edit: function(event) {
      if (this.notMutable()) return;
      $(event.target).attr('contenteditable', true);
    },

    save: function(event) {
      if (this.notMutable()) return;
      $(event.target).attr('contenteditable', false);

      this.model.set($(event.target).data('field'), $(event.target).text().trim());
      this.model.save(null, {
        url: haDash.API + '/transcripts/' + this.model.id
      });
    },

    clone: function() {
      if (!haDash.user) {
        haDash.router.navigate("secret-signin/", {trigger: true});
        this.remove();
      }

      var transcript = this.model.clone();
      transcript.set({
        label: 'clone of ' + transcript.get('label'),
        owner: haDash.user
      });
      transcript.unset('_id');

      transcript.save(null, {
        url: haDash.API + '/transcripts'
      });

    },

    align: function() {
      if (!haDash.user) {
        haDash.router.navigate("secret-signin/", {trigger: true});
        this.remove();
      }

      $.ajax({
        url: haDash.API + '/transcripts/' + this.model.id + '/align',
        contentType: "application/json; charset=utf-8",
          dataType: "json",
        xhrFields: {
          withCredentials: true
        },
        method: 'post',
        data: JSON.stringify({})
      })
      .done(function() {
        console.log('OK');
        })
        .fail(function() {
            console.log('ERR');
        });
    },

    delete: function() {
      if (this.notMutable()) return;

      this.model.destroy({
        url: haDash.API + '/transcripts/' + this.model.id
      });
    }

    });

})();
