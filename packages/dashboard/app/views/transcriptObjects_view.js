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
  	var $transcriptObjects, $transcriptObjectsU,
  		collection = this.collection;
  		
    collection.sort();

  	$(this.el).html(this.template({})); 	
  	$transcriptObjects = $('#transcriptObjectsW').empty();
  	$transcriptObjectsU = $('#transcriptObjectsWU').empty();

  	collection.each(function (transcriptObject) {
  		var view = new TranscriptObjectView({
  			model: transcriptObject,
  			collection: collection
  		});
  		
  		var el = view.render().el;
  		
  		if (window.user && window.user.username == transcriptObject.get('owner')) {
    		$transcriptObjectsU.append(el);
		  } else {
    		$transcriptObjects.append(el);
		  }
  		
      $(el)
        .data('view', view)
        .data('model', transcriptObject);
        
        
        
      
  	});
  	
  	if (window.user) {
      $transcriptObjectsU.find('a.transLabel').editable({
        type: 'text',
        title: 'Edit label',
          success: function(response, newValue) {
            transcriptObject.set('label', newValue, {silent: true});
            transcriptObject.save(null, { silent: true });
          }
      });
      $transcriptObjectsU.find('.transDesc').editable({
        type: 'text',
        title: 'Edit description',
          success: function(response, newValue) {
            transcriptObject.set('desc', newValue, {silent: true});
            transcriptObject.save(null, { silent: true });
          }
      });
        
    }
  	
  	//
  	$('#upload').click(function(){
      filepicker.pick({
        services: ["COMPUTER", "VIDEO", "WEBCAM", "URL", "DROPBOX", "GOOGLE_DRIVE", "FACEBOOK", "GITHUB"]
      },
      function(InkBlob){
        // console.log(InkBlob.url);
        console.log(InkBlob);
        collection.create({
          '_id': null,  
          label: InkBlob.filename,
          desc: "",
          type: InkBlob.mimetype.split('/')[0],
          sort: 999,
          owner: window.user.username,
          meta: {
            filename: InkBlob.filename,
            mimetype: InkBlob.mimetype,
            size: InkBlob.size,
            url: InkBlob.url,
            key: InkBlob.key
          }
        }); //FIXME sort
        
        collection.trigger('reset');
      },
      function(err){
        //ERR
        console.log(err);
      });
    });
  	//
  	
  	return this;
  }

  
});
