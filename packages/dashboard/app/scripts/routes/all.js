/*global haDash, Backbone*/

haDash.Routers = haDash.Routers || {};

(function () {
    'use strict';

    haDash.Routers.Router = Backbone.Router.extend({
        routes: {
            '': 'mix'
        },
        
        mix: function() {
            alert(1);
            // $('#mix').html(
            console.log(haDash.mixView.render().el);
        }
        
    });

})();
