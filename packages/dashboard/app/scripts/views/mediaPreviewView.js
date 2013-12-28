/*global haDash, Backbone, JST*/

haDash.Views = haDash.Views || {};

(function () {
    'use strict';

    haDash.Views.MediaPreviewView = Backbone.View.extend({

		id: '#mediaPreview',

        template: JST['app/scripts/templates/mediaPreview.ejs'],

		initialize: function() {
			this.listenTo(this.model, 'change', this.render);
		},

		render: function() {
			this.$el.html(this.template(this.model.toJSON()));
			this.$el.find("span.timeago").timeago();
			return this;
		}

    });

})();

