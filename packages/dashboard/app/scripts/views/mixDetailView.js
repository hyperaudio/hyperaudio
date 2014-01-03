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
      }

    });

})();
