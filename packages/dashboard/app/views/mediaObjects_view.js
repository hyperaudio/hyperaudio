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
        
        $(el).find('a.mediaPreview').click(function(evt) {
          evt.preventDefault();
          $('#modalPreview .modal-title').text(mediaObject.get('label'));
          if (mediaObject.get('type') == 'video') {
            $('#modalPreview .modal-body').empty().append('<video controls autoplay src="http://data.hyperaud.io/' + mediaObject.get('owner') + '/' + mediaObject.get('meta').filename + '"></video>');
          } else {
            $('#modalPreview .modal-body').empty().append('<audio controls autoplay src="http://data.hyperaud.io/' + mediaObject.get('owner') + '/' + mediaObject.get('meta').filename + '"></audio>');
          }
          $('#createTranscript').attr('href', 'http://hyperaud.io/maker/?m=' + mediaObject.get('_id'));
          $('#convertTranscript').attr('href', 'http://hyperaud.io/converter/?m=' + mediaObject.get('_id'));
          $('#modalPreview')
            .modal('show')
            .on('hide.bs.modal', function() {
              $('#modalPreview .modal-body').empty();
            });
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
  	
  	return this;
  }

  
});
