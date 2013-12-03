/*global haDash, Backbone*/

haDash.Collections = haDash.Collections || {};

(function () {
    'use strict';

    haDash.Collections.MixCollection = Backbone.Collection.extend({

        model: haDash.Models.MixModel

    });

})();
