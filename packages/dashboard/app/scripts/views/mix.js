/*global haDash, Backbone, JST*/

haDash.Views = haDash.Views || {};

(function () {
    'use strict';

    haDash.Views.MixView = Backbone.View.extend({

        template: JST['app/scripts/templates/mix.ejs']

    });

})();
