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
		},

		events: {
			"click h2.label, p.desc": "edit",
			"blur h2.label": "saveLabel",
			"blur p.desc": "saveDesc"
		},

		edit: function(event) {
			if (!this.model.get('owner') == haDash.user) return;
			$(event.target).attr('contenteditable', true);
		},

		saveLabel: function(event) {
			if (!this.model.get('owner') == haDash.user) return;
			$(event.target).attr('contenteditable', false);
			this.model.set('label', $(event.target).text().trim());
			this.save();
		},

		saveDesc: function(event) {
			if (!this.model.get('owner') == haDash.user) return;
			$(event.target).attr('contenteditable', false);
			this.model.set('desc', $(event.target).text().trim());
			this.save();
		},

		save: function() {
			if (!this.model.get('owner') == haDash.user) return;
			this.model.save(null, {
				url: haDash.API + '/media/' + this.model.id
			});
		}

    });

})();

