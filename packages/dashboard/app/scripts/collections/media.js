/*global haDash, Backbone*/

haDash.Collections = haDash.Collections || {};

(function () {
    'use strict';

    haDash.Collections.MediaCollection = Backbone.Collection.extend({

        model: haDash.Models.MediaModel

    });

})();
