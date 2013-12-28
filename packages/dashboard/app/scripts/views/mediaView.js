/*global haDash, Backbone, JST*/

haDash.Views = haDash.Views || {};

(function () {
    'use strict';

    haDash.Views.MediaView = Backbone.View.extend({

		tagName: 'tr',

        template: JST['app/scripts/templates/media.ejs'],

		initialize: function() {
			this.listenTo(this.model, 'change', this.render);
		},

		render: function() {
			this.$el.html(this.template(this.model.toJSON()));
			this.$el.find("span.timeago").timeago();
			return this;
		},

		events: {
			'click .label': 'preview'
		},

		preview: function() {
			var model = this.model;
			model.fetch();

			new haDash.Views.MediaPreviewView({
				model: model
			}).render();
		}

    });

})();
