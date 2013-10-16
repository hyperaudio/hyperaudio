var View = require('./view');
var template = require('./templates/transcriptObject');

module.exports = View.extend({
  className: 'transcript',
  template: template,
  tagName: 'tr',

  initialize: function() {
    console.log('init transcriptObjectView');
  	_.bindAll(this, 'render');
  	this.model.bind('change', this.render);
  },

  render: function() {
  	this.$el.html(this.template(this.model.toJSON()));  	
  	return this;
  }

});
