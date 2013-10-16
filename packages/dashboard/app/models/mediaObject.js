module.exports = Backbone.Model.extend({
  	idAttribute: "_id",
	
	defaults: function() {
          return {
            label:  "Empty",
            desc: "no content",
            type: "audio",
            sort: 0,
            owner: null,
            meta: {
              filename: "empty.bin",
              mimetype: "audio/*",
              size: 0,
              url: ""
            }
          };
    }
});