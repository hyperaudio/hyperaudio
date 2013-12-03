/*global haDash, Backbone*/

haDash.Routers = haDash.Routers || {};

(function () {
    'use strict';

    haDash.Routers.Router = Backbone.Router.extend({
        routes: {
            '': 'dashboard',
            'mixes': 'mixes',
            'media': 'media'
        },
        
        dashboard: function() {
            console.log('Dashboard N/A');
            //TODO redirect to /
        },
        
        mixes: function() {
            console.log('mixes');
            haDash.mixView = new haDash.Views.MixesView({
                collection: new haDash.Collections.MixCollection()
            });
        },
        
        media: function() {
            console.log('media');
        }
        
    });

})();
