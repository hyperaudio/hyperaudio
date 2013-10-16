var View = require('./view');
var template = require('./templates/mediaObjects');

var MediaObject = require('models/mediaObject');
var MediaObjectView = require('views/mediaObject_view');

module.exports = View.extend({
  className: 'mediaObjects',
  template: template,

  initialize: function() {
    console.log('init mediaObjectsView');
  	_.bindAll(this, 'render');
    this.collection.bind('reset', this.render);
    // this.collection.bind('update', this.render);
  },

  render: function() {
  	var $mediaObjects,
  		collection = this.collection;
  		
    collection.sort();

  	$(this.el).html(this.template({})); 	
  	$mediaObjects = $('#mediaObjectsW').empty();

  	collection.each(function (mediaObject) {
  		var view = new MediaObjectView({
  			model: mediaObject,
  			collection: collection
  		});
  		
  		var el = view.render().el;
  		$mediaObjects.append(el);
      $(el)
        .data('view', view)
        .data('model', mediaObject)
        .find('a.mediaLabel').editable({
          type: 'text',
          title: 'Edit label',
            success: function(response, newValue) {
              mediaObject.set('label', newValue, {silent: true});
              mediaObject.save(null, { silent: true });
            }
        });  
      
  	});
  	
  	return this;
  }

  
});
