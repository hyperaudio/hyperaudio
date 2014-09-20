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
      console.log('render ' + this.model.get('status'));
      this.$el.html(this.template(this.model.toJSON()));
      this.$el.find("span.timeago").timeago();

      this.$el.data('view', this);
      this.$el.data('model', this.model);
      return this;
    },

    events: {
      "click .tLabel, .tDesc": "edit",
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
        url: haDash.API + '/transcripts',
        success: function() {
          $('#mediaDetail').data('view').render();
        },
        error: function() {
          //TODO, alert?
          $('#mediaDetail').data('view').render();
        }
      });

      //TODO use it in success above
      // $('#mediaDetail').data('view').render();

    },

    refresh: function() {
      if (this.refreshing) return;

      if (this.model.get('status') == null || !this.model.get('status').alignment) {
        var self = this;
        this.refreshing = setInterval(function() {
          self.model.fetch({
            url: haDash.API + '/transcripts/' + self.model.id + '/poll?salt=' + Math.random(),
            success: function(model) {
              console.log(model);
              // self.render();
              self.refresh();
            }
          });
        }, 2000);
      }
    },

    align: function() {
      if (!haDash.user) {
        haDash.router.navigate("secret-signin/", {trigger: true});
        this.remove();
      }

      var lang = this.$el.find('select').val();

      if (!lang) lang = haDash.lang;
      alert(lang);
      return;

      var self = this;
      $.ajax({
        url: haDash.API + '/transcripts/' + this.model.id + '/align',
        contentType: "application/json; charset=utf-8",
          dataType: "json",
        xhrFields: {
          withCredentials: true
        },
        method: 'post',
        data: JSON.stringify({
          lang: lang
        })
      })
      .done(function() {
          console.log('OK');
          self.refresh();
        })
      .fail(function() {
        console.log('ERR');
      });
      // spin
      //$('#mediaDetail').data('view').refresh();
      // spin
    },

    delete: function() {
      if (this.notMutable()) return;

      this.model.destroy({
        url: haDash.API + '/transcripts/' + this.model.id,
        success: function() {
          $('#mediaDetail').data('view').render();
        },
        error: function() {
          //TODO, alert?
          $('#mediaDetail').data('view').render();
        }
      });

      //TODO use it in success above
      // $('#mediaDetail').data('view').render();
    }

    });

})();
