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
			this.afterRender();
			return this;
		},

		afterRender: function() {
			this.$("span.timeago").timeago();
		},

		addItem: function(item) {
			var view = new haDash.Views.MediaView({
				model: item
			});

			if (haDash.user && haDash.user.username == item.get('owner')) {
				this.$('tbody.your').append(view.render().el);
			} else {
				this.$('tbody.other').append(view.render().el);
			}
		},

		addAllItems: function() {
			this.collection.each(this.addItem, this);
		},

		events: {
			'click #addMedia': 'addMedia'
		},

		addMedia: function() {
			haDash.router.navigate("add-media/", {trigger: true});
		}

    });

})();
