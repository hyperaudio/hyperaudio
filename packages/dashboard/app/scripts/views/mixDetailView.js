/*global haDash, Backbone, JST*/

haDash.Views = haDash.Views || {};

(function () {
    'use strict';

    haDash.Views.MixdetailView = Backbone.View.extend({

        template: JST['app/scripts/templates/mixDetail.ejs']

    });

})();
