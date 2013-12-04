/*global haDash, Backbone, JST*/

haDash.Views = haDash.Views || {};

(function () {
    'use strict';

    haDash.Views.MediaView = Backbone.View.extend({

        template: JST['app/scripts/templates/media.ejs']

    });

})();
