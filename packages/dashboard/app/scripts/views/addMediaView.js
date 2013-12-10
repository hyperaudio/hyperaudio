/*global haDash, Backbone, JST*/

haDash.Views = haDash.Views || {};

(function () {
    'use strict';

    haDash.Views.AddMediaView = Backbone.View.extend({

		el: '#addMediaModal',

        template: JST['app/scripts/templates/addMedia.ejs'],
		
		initialize: function() {
			this.listenTo(this.model, 'change', this.render);
		},

		render: function() {
			this.$el.html(this.template(this.model.toJSON()));
			
			this.$el.foundation('reveal', 'open');
			
			return this;
		}

    });

})();
