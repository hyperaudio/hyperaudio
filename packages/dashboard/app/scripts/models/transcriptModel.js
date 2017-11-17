/*global haDash, Backbone*/

haDash.Models = haDash.Models || {};

(function() {
  'use strict';

  haDash.Models.TranscriptModel = Backbone.Model.extend({
    idAttribute: '_id',

    defaults: function() {
      return {
        label: 'Empty',
        desc: '',
        type: 'text',
        owner: null,
        // namespace: window.haDash.namespace,
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
        meta: {},
        media: null,
        status: null
      };
    }
  });
})();
