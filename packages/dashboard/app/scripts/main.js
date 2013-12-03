/*global haDash, $*/


window.haDash = {
    API: (document.location.host == '10.0.54.74')?'http://10.0.54.74':'http://data.hyperaud.io',
    Models: {},
    Collections: {},
    Views: {},
    Routers: {},
    init: function () {
        'use strict';
        
        this.mixView = new this.Views.MixesView({
            collection: new this.Collections.MixCollection()
        });
        
        this.router = new this.Routers.Router();        
    }
};

$(document).ready(function () {
    'use strict';
    
    haDash.init();
});
