/*global haDash, Backbone*/

haDash.Collections = haDash.Collections || {};

(function () {
    'use strict';
    haDash.Collections.MediaCollection = Backbone.Collection.extend({
      model: haDash.Models.MediaModel,

      url: function() {
        return haDash.API + '/media';
      },

      comparator: function(model) {
         return - new Date(model.get('modified')).getTime();
      }
    });
})();
