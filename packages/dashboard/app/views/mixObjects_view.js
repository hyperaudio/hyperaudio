var View = require('./view');
var template = require('./templates/mixObjects');

var MixObject = require('models/mixObject');
var MixObjectView = require('views/mixObject_view');

module.exports = View.extend({
  className: 'mixObjects',
  template: template,

  initialize: function() {
    console.log('init mixObjectsView');
  	_.bindAll(this, 'render');
    this.collection.bind('reset', this.render);
  },

  render: function() {
  	var $mixObjects, $mixObjectsU,
  		collection = this.collection;
  		
    collection.sort();

  	$(this.el).html(this.template({})); 	
  	$mixObjects = $('#mixObjectsW').empty();
  	$mixObjectsU = $('#mixObjectsWU').empty();

  	collection.each(function (mixObject) {
  		var view = new MixObjectView({
  			model: mixObject,
  			collection: collection
  		});
  		
  		var el = view.render().el;
  		
  		if (window.user && window.user.username == mixObject.get('owner')) {
  		  $mixObjectsU.append(el);
		  } else {
    		$mixObjects.append(el);		    
		  }
      $(el)
        .data('view', view)
        .data('model', mixObject);
        
        
      
  	});
  	
  	if (window.user) {
      $mixObjectsU.find('a.mixLabel').editable({
        type: 'text',
        title: 'Edit label',
          success: function(response, newValue) {
            mixObject.set('label', newValue, {silent: true});
            mixObject.save(null, { silent: true });
          }
      });
      $mixObjectsU.find('.mixDesc').editable({
        type: 'text',
        title: 'Edit description',
          success: function(response, newValue) {
            mixObject.set('desc', newValue, {silent: true});
            mixObject.save(null, { silent: true });
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
