/*global haDash, Backbone, JST*/

haDash.Views = haDash.Views || {};

(function () {
    'use strict';

    haDash.Views.AddmediaView = Backbone.View.extend({

        template: JST['app/scripts/templates/addMedia.ejs']

    });

})();
