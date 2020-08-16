/*global haDash, Backbone, JST*/

haDash.Views = haDash.Views || {};

(function() {
  'use strict';

  haDash.Views.NotFoundView = Backbone.View.extend({
    template: JST['app/scripts/templates/404.ejs'],

    initialize: function() {
      this.render();
    },

    render: function() {
      this.$el.html(this.template());
      return this;
    }
  });
})();
