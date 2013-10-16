var View = require('./view');
var template = require('./templates/mediaObject');

module.exports = View.extend({
  className: 'mediaObject',
  template: template,
  tagName: 'tr',

  initialize: function() {
    console.log('init mediaObjectView');
  	_.bindAll(this, 'render');
  	this.model.bind('change', this.render);
  },

  render: function() {
  	this.$el.html(this.template(this.model.toJSON()));  	
  	return this;
  }

});
