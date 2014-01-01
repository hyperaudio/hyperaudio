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

			this.$el.data('view', this);
			this.$el.data('model', this.model);
			return this;
		},

		events: {
			'click td': 'mediaDetail'
		},

		mediaDetail: function() {
			haDash.router.navigate("media/" + this.model.id, {trigger: true});
		}

    });

})();
