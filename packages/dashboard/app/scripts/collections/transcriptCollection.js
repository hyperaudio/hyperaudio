/*global haDash, Backbone*/

haDash.Collections = haDash.Collections || {};

(function () {
    'use strict';

    haDash.Collections.TranscriptCollection = Backbone.Collection.extend({

        model: haDash.Models.TranscriptModel

    });

})();
