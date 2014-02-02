/*global haDash, Backbone*/

haDash.Models = haDash.Models || {};

(function() {
  'use strict';

  haDash.Models.MediaModel = Backbone.Model.extend({

      idAttribute: "_id",

      defaults: function() {
        return {
          label: "",
          desc: "",
          type: "video",
          owner: null,
          source: {},
          created: new Date().toISOString(),
          modified: new Date().toISOString(),
          tags: [],
          channel: null
        };
      }
  });

})();
