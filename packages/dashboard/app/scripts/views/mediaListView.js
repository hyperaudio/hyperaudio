/*global haDash, Backbone, JST*/

haDash.Views = haDash.Views || {};

(function () {
    'use strict';

    haDash.Views.MediaListView = Backbone.View.extend({

		id: 'mediaListView',

        template: JST['app/scripts/templates/mediaList.ejs'],

		initialize: function() {
			// this.render();
			// this.addAllItems();

			this.listenTo(this.collection, 'add', this.addItem);
			this.listenTo(this.collection, 'reset', this.render);
			this.listenTo(this.collection, 'sort', this.render);

			// this.collection.fetch();
		},

		render: function() {
			this.$el.html(this.template()).appendTo('#main');
			// this.afterRender();
			this.addAllItems();
			return this;
		},

		// afterRender: function() {

		// },

		addItem: function(item) {
			console.log('media adding items: ' + item.get('_id'));
			var view = new haDash.Views.MediaView({
				model: item
			});

			if (haDash.user == item.get('owner')) {
				this.$el.find('tbody.your').append(view.render().el);
			} else {
				this.$el.find('tbody.other').append(view.render().el);
			}
		},

		addAllItems: function() {
			console.log('media adding all items: ' + this.collection.length);
			this.collection.each(this.addItem, this);
		},

		events: {
			'click #addMedia': 'addMedia'
		},

		addMedia: function() {
			haDash.router.navigate("add-media/", {trigger: true});
			this.remove();
		}

    });

})();
