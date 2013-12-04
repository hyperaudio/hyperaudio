/*global haDash, Backbone, JST*/

haDash.Views = haDash.Views || {};

(function() {
	'use strict';

	haDash.Views.MixView = Backbone.View.extend({

		tagName: 'tr',

		template: JST['app/scripts/templates/mix.ejs'],

		initialize: function() {
			this.listenTo(this.model, 'change', this.render);
		},

		render: function() {
			this.$el.html(this.template(this.model.toJSON()));

			return this;
		}
	});

})();
