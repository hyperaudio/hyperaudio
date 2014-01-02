/*global haDash, Backbone*/

haDash.Models = haDash.Models || {};

(function() {
  'use strict';

  haDash.Models.MixModel = Backbone.Model.extend({

    idAttribute: "_id",

    defaults: function() {
      return {
        label: "Empty",
        desc: "",
        type: "html",
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
        owner: null
      };
    }

  });

})();
