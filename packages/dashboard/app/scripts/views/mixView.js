/*global haDash, Backbone, JST*/

haDash.Views = haDash.Views || {};

(function() {
  'use strict';

  haDash.Views.MixView = Backbone.View.extend({
    tagName: 'tr',

    template: JST['app/scripts/templates/mix.ejs'],

    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.$el.find('span.timeago').timeago();

      this.$el.data('view', this);
      this.$el.data('model', this.model);
      return this;
    },

    events: {
      'click td': 'openPad',
      'click button.details': 'mixDetail'
    },

    openPad: function() {
      document.location = '/pad/?m=' + this.model.id;
    },

    mixDetail: function(event) {
      event.stopPropagation();
      haDash.router.navigate('mixes/' + this.model.id, { trigger: true });
    }
  });
})();
