/*global haDash, Backbone, JST*/

haDash.Views = haDash.Views || {};

(function () {
    'use strict';

    haDash.Views.MedialistView = Backbone.View.extend({

        template: JST['app/scripts/templates/medialist.ejs']

    });

})();
