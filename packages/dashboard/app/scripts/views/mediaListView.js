/*global haDash, Backbone, JST*/

haDash.Views = haDash.Views || {};

(function () {
    'use strict';

    haDash.Views.MediaListView = Backbone.View.extend({
		
		el: '#main',

        template: JST['app/scripts/templates/mediaList.ejs'],
		
		initialize: function() {
			this.render();

			this.listenTo(this.collection, 'add', this.addItem);
			this.listenTo(this.collection, 'reset', this.addAllItems);

			this.collection.fetch();
		},

		render: function() {
			this.$el.html(this.template());
			// this.afterRender();
			return this;
		},
		
		// afterRender: function() {},

		addItem: function(item) {
			var view = new haDash.Views.MediaView({
				model: item
			});
			this.$('tbody').append(view.render().el);
		},

		addAllItems: function() {
			this.collection.each(this.addItem, this);
		}

    });

})();
