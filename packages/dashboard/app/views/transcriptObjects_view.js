var View = require('./view');
var template = require('./templates/transcriptObjects');

var TranscriptObject = require('models/transcriptObject');
var TranscriptObjectView = require('views/transcriptObject_view');

module.exports = View.extend({
  className: 'transcriptObjects',
  template: template,

  initialize: function() {
    console.log('init transcriptObjectsView');
  	_.bindAll(this, 'render');
    this.collection.bind('reset', this.render);
  },

  render: function() {
  	var $transcriptObjects,
  		collection = this.collection;
  		
    collection.sort();

  	$(this.el).html(this.template({})); 	
  	$transcriptObjects = $('#transcriptObjectsW').empty();

  	collection.each(function (transcriptObject) {
  		var view = new TranscriptObjectView({
  			model: transcriptObject,
  			collection: collection
  		});
  		
  		var el = view.render().el;
  		$transcriptObjects.append(el);
      $(el)
        .data('view', view)
        .data('model', transcriptObject);
        
        if (window.user) {
          $(el).find('a.transLabel').editable({
            type: 'text',
            title: 'Edit label',
              success: function(response, newValue) {
                transcriptObject.set('label', newValue, {silent: true});
                transcriptObject.save(null, { silent: true });
              }
          });
          $(el).find('.transDesc').editable({
            type: 'text',
            title: 'Edit description',
              success: function(response, newValue) {
                transcriptObject.set('desc', newValue, {silent: true});
                transcriptObject.save(null, { silent: true });
              }
          });  
        }
      
  	});
  	
  	return this;
  }

  
});
