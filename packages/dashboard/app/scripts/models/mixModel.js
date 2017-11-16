/*global haDash, Backbone*/

haDash.Models = haDash.Models || {};

(function() {
  'use strict';

  haDash.Models.MixModel = Backbone.Model.extend({
    idAttribute: "_id",

    defaults: function() {
      return {
        label: "",
        desc: "",
        type: "html",
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
        owner: null,
        namespace: window.haDash.namespace,
        tags: [],
        meta: {},
        channel: null
      };
    }
  });
})();
