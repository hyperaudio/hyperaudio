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
  	var $mixObjects,
  		collection = this.collection;
  		
    collection.sort();

  	$(this.el).html(this.template({})); 	
  	$mixObjects = $('#mixObjectsW').empty();

  	collection.each(function (mixObject) {
  		var view = new MixObjectView({
  			model: mixObject,
  			collection: collection
  		});
  		
  		var el = view.render().el;
  		$mixObjects.append(el);
      $(el)
        .data('view', view)
        .data('model', mixObject)
        .find('a.mixLabel').editable({
          type: 'text',
          title: 'Edit label',
            success: function(response, newValue) {
              mixObject.set('label', newValue, {silent: true});
              mixObject.save(null, { silent: true });
            }
        });
        $(el).find('.mixDesc').editable({
          type: 'text',
          title: 'Edit description',
            success: function(response, newValue) {
              mixObject.set('desc', newValue, {silent: true});
              mixObject.save(null, { silent: true });
            }
        });  
      
  	});
  	
  	return this;
  }

  
});
