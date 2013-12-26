/*global haDash, Backbone, JST*/

haDash.Views = haDash.Views || {};

(function () {
    'use strict';

    haDash.Views.AddMediaView = Backbone.View.extend({

		el: '#addMediaModal',

        template: JST['app/scripts/templates/addMedia.ejs'],

		initialize: function() {
			this.listenTo(this.model, 'change', this.render);
		},

		render: function() {
			this.$el.html(this.template(this.model.toJSON()));

			this.$el.foundation('reveal', 'open');

			return this;
		},

		events: {
			"click button": "addYT"
		},

		addYT: function() {
			var ytUrl = new URI(this.$el.find('input').val());
			var ytID = ytUrl.search(true)['v'];

			console.log(ytID);

			var model = this.model;

			$.ajax({
				url: "http://gdata.youtube.com/feeds/api/videos/" + ytID + "?v=2&alt=json",
				success: function(ytData) {
					console.log(ytData);

					//clean yt json
					var cleanYtData = {};

					function ytClone(destination, source) {
					  for (var property in source) {
					    var prop = property.replace(/\$/g, '_');
					    if (typeof source[property] === "object" &&
					     source[property] !== null ) {
					      destination[prop] = destination[prop] || {};
					      ytClone(destination[prop], source[property]);
					    } else {
					      destination[prop] = source[property];
					    }
					  }
					  return destination;
					};

					ytClone(cleanYtData, ytData);

					model.set('owner', haDash.user);
					model.set('label', ytData.entry.title["$t"]);
					model.set('desc', ytData.entry["media$group"]["media$description"]["$t"]);
					model.set('meta', {
						"youtube": cleanYtData
					});
					model.set('source', {
						"youtube": {
						      "type": "video/youtube",
						      "url": "http://www.youtube.com/watch?v=" + ytID
						 }
					});

					console.log(model);

					haDash.mediaListView.collection.push(model);

					model.save();
				}
			});
		}

    });

})();

/*
					label: "Empty",
					desc: "no content",
					type: "text",
					// sort: 0,
					owner: null,
					meta: {},
					transcripts: []
*/
