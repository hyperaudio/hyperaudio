/*global haDash, Backbone, JST*/

haDash.Views = haDash.Views || {};

(function () {
    'use strict';

    haDash.Views.MediaDetailView = Backbone.View.extend({

		id: '#mediaDetail',

        template: JST['app/scripts/templates/mediaDetail.ejs'],

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
			"click h2.label, p.desc": "edit",
			"blur h2.label, p.desc": "save"
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
				url: haDash.API + '/media/' + this.model.id
			});
		}

    });

})();

