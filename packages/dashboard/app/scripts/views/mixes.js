/*global haDash, Backbone, JST*/

haDash.Views = haDash.Views || {};

(function() {
	'use strict';

	haDash.Views.MixesView = Backbone.View.extend({

		el: '#main',

		template: JST['app/scripts/templates/mixes.ejs'],

		initialize: function() {
			this.render();

			this.listenTo(this.collection, 'add', this.addItem);
			this.listenTo(this.collection, 'reset', this.addAllItems);

			this.collection.fetch();
		},

		render: function() {
			this.$el.html(this.template());

			return this;
		},

		addItem: function(todo) {
			var view = new haDash.Views.MixView({
				model: todo
			});
			this.$('tbody').append(view.render().el);
		},

		addAllItems: function() {
			this.collection.each(this.addTodoItem, this);
		}
	});

})();
