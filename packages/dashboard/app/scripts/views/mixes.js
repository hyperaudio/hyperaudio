/*global haDash, Backbone, JST*/

haDash.Views = haDash.Views || {};

(function () {
    'use strict';

    haDash.Views.MixesView = Backbone.View.extend({
        
        el: '#mixes',

        template: JST['app/scripts/templates/mixes.ejs'],
        
        initialize: function () {
            this.render();

            this.listenTo(this.collection, 'add', this.addTodoItem);
            this.listenTo(this.collection, 'reset', this.addAllTodoItems);

            this.collection.fetch();
        },

        render: function () {
            this.$el.html(this.template());

            return this;
        },
        
        addTodoItem: function (todo) {
            var view = new haDash.Views.MixView({ model: todo });
            this.$('ul').append(view.render().el);
        },
        
        addAllTodoItems: function () {
            this.collection.each(this.addTodoItem, this);
        }
    });

})();
