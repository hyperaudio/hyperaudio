/*global haDash, Backbone*/

haDash.Models = haDash.Models || {};

(function () {
    'use strict';

    haDash.Models.MixModel = Backbone.Model.extend({
        
        idAttribute: "_id",
        
        defaults: function() {
            return {
                label:  "Empty",
                desc: "no content",
                type: "text",
                sort: 0,
                owner: null,
                meta: {}
            };
        }

    });

})();
