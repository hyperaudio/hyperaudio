var View = require('./view');
var template = require('./templates/mixObject');

module.exports = View.extend({
  className: 'mix',
  template: template,
  tagName: 'tr',

  initialize: function() {
    console.log('init mixObjectView');
  	_.bindAll(this, 'render');
  	this.model.bind('change', this.render);
  },

  render: function() {
  	this.$el.html(this.template(this.model.toJSON()));  	
  	return this;
  }

});
