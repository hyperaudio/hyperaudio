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
  	var $mediaObjects, $mediaObjectsU,
  		collection = this.collection;
  		
    collection.sort();

  	$(this.el).html(this.template({})); 	
  	$mediaObjects = $('#mediaObjectsW').empty();
  	$mediaObjectsU = $('#mediaObjectsWU').empty();

  	collection.each(function (mediaObject) {
  		var view = new MediaObjectView({
  			model: mediaObject,
  			collection: collection
  		});
  		
  		var el = view.render().el;
  		
  		if (window.user && window.user.username == mediaObject.get('owner')) {
  		  $mediaObjectsU.append(el);
  		} else {
  		  $mediaObjects.append(el);
  		}
  		
      $(el).data('view', view)
        .data('model', mediaObject);
        
        $(el).find('a.mediaMD').click(function(evt) {
          evt.preventDefault();
          $('#metadataPreview .modal-body').empty().append('<pre class="meta"></pre><pre class="probe"></pre>');
          $('#metadataPreview .modal-body').find('.meta').text(JSON.stringify(mediaObject.get('meta'), null, " "));
          $('#metadataPreview .modal-body').find('.probe').text(JSON.stringify(mediaObject.get('probe'), null, " "));
          $('#metadataPreview').modal('show')
        });
      
  	});//each
  	
  	if (window.user) {
      $mediaObjectsU.find('a.mediaLabel').editable({
        type: 'text',
        title: 'Edit label',
          success: function(response, newValue) {
            mediaObject.set('label', newValue, {silent: true});
            mediaObject.save(null, { silent: true });
          }
      });
    
      $mediaObjectsU.find('.mediaDesc').editable({
        type: 'text',
        title: 'Edit description',
          success: function(response, newValue) {
            mediaObject.set('desc', newValue, {silent: true});
            mediaObject.save(null, { silent: true });
          }
      });  
    }
  	
  	$('#upload').click(function(){
      filepicker.pick({
        services: ["COMPUTER", "VIDEO", "WEBCAM", "URL", "DROPBOX", "GOOGLE_DRIVE", "FACEBOOK", "GITHUB"]
      },
      function(InkBlob){
        // console.log(InkBlob.url);
        console.log(InkBlob);
        mediaObjects.create({
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
        
        mediaObjects.trigger('reset');
      },
      function(err){
        //ERR
        console.log(err);
      });
    });
  	
  	return this;
  }

  
});
