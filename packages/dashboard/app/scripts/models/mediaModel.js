/*global haDash, Backbone*/

haDash.Models = haDash.Models || {};

(function() {
  'use strict';

  haDash.Models.MediaModel = Backbone.Model.extend({

      idAttribute: "_id",

      defaults: function() {
        return {
          label: "Not set",
          desc: "Not set",
          type: "video",
          owner: null,
          namespace: window.haDash.namespace,
          source: {},
          created: new Date().toISOString(),
          modified: new Date().toISOString(),
          tags: [],
          channel: null
        };
      }
  });

})();
