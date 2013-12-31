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
		},

		events: {
			"click .tLabel, tDesc": "edit",
			"blur .tLabel, .tDesc": "save",
			"click .align": "align"
		},

		notEditable: function() {
			return this.model.get('owner') != haDash.user;
		},

		edit: function(event) {
			if (this.notEditable()) return;
			$(event.target).attr('contenteditable', true);
		},

		save: function(event) {
			if (this.notEditable()) return;
			$(event.target).attr('contenteditable', false);

			this.model.set($(event.target).data('field'), $(event.target).text().trim());
			this.model.save(null, {
				url: haDash.API + '/transcripts/' + this.model.id
			});
		},

		align: function() {
			alert('1');
		}

    });

})();
