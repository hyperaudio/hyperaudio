/*global haDash, Backbone, JST*/

haDash.Views = haDash.Views || {};

(function () {
    'use strict';

    haDash.Views.TranscriptView = Backbone.View.extend({

        template: JST['app/scripts/templates/transcript.ejs']

    });

})();
