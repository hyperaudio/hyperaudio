/*global haDash, $*/


window.haDash = {
    API: (document.location.host == '10.0.54.74')?'http://10.0.54.74':'http://data.hyperaud.io', //FIXME
    Models: {},
    Collections: {},
    Views: {},
    Routers: {},
    init: function () {
        'use strict';
        
        this.router = new this.Routers.Router();        
        
        Backbone.history.start({pushState: true});
    }
};

$(document).ready(function () {
    'use strict';
    
    haDash.init();
});
