/*global haDash, Backbone*/

haDash.Collections = haDash.Collections || {};

(function () {
    'use strict';

    haDash.Collections.TranscriptCollection = Backbone.Collection.extend({

        model: haDash.Models.TranscriptModel,

        url: function() {
			return haDash.API + '/transcripts';
		},

		comparator: function(model) {
     	   return - new Date(model.get('modified')).getTime();
    	}

    });

})();
