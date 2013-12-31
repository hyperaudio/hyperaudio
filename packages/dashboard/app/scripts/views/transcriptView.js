/*global haDash, Backbone, JST*/

haDash.Views = haDash.Views || {};

(function () {
    'use strict';

    haDash.Views.TranscriptView = Backbone.View.extend({

        tagName: 'tr',

        template: JST['app/scripts/templates/transcript.ejs'],

		initialize: function() {
			this.listenTo(this.model, 'change', this.render);
		},

		render: function() {
			this.$el.html(this.template(this.model.toJSON()));
			this.$el.find("span.timeago").timeago();

			this.$el.data('view', this);
			this.$el.data('model', this.model);
			return this;
		}

    });

})();
