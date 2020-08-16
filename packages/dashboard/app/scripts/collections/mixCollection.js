/*global haDash, Backbone*/

haDash.Collections = haDash.Collections || {};

(function() {
  'use strict';
  haDash.Collections.MixCollection = Backbone.Collection.extend({
    model: haDash.Models.MixModel,

    url: function() {
      return haDash.API + '/mixes';
    },

    comparator: function(model) {
      return -new Date(model.get('modified')).getTime();
    }
  });
})();
