/*global haDash, Backbone, JST*/

haDash.Views = haDash.Views || {};

(function() {
  'use strict';

  haDash.Views.MixListView = Backbone.View.extend({

    id: 'mixListView',

    template: JST['app/scripts/templates/mixList.ejs'],

    initialize: function() {
      this.listenTo(this.collection, 'add', this.addItem);
      this.listenTo(this.collection, 'reset', this.addAllItems);
      this.listenTo(this.collection, 'sort', this.render);
    },

    render: function() {
      this.$el.html(this.template());
      this.addAllItems();

      this.$el.data('view', this);
      this.$el.data('collection', this.collection);
      return this;
    },

    addItem: function(item) {
      var view = new haDash.Views.MixView({
        model: item
      });

      // if (haDash.user == item.get('owner')) {
      //   this.$('tbody.your').append(view.render().el);
      // } else {
      //   this.$('tbody.other').append(view.render().el);
      // }

      var $tbody;
      var channel = item.get('channel');
      if (!channel) {
        channel = "nochannel";
      } else {
        channel = channel.replace(' ', '_');
      }

      if (haDash.user == item.get('owner')) {
        $tbody = this.$el.find('.your tbody.' + channel);
        if ($tbody.length == 0) {
          var $table = $(this.$el.find('.your table').get(0));
          var $clone = $table.clone();
          $table.after($clone);
          $clone.find('caption').text(channel.replace('_', ' '));
          $clone.find('tbody').empty();
          $clone.find('tbody').attr('class', channel);
          $tbody = this.$el.find('.your tbody.' + channel);
        }
      } else {
        $tbody = this.$el.find('.other tbody.' + channel);
        if ($tbody.length == 0) {
          var $table = $(this.$el.find('.other table').get(0));
          var $clone = $table.clone();
          $table.after($clone);
          $clone.find('caption').text(channel.replace('_', ' '));
          $clone.find('tbody').empty();
          $clone.find('tbody').attr('class', channel);
          $tbody = this.$el.find('.other tbody.' + channel);
        }
      }

      $tbody.append(view.render().el);
    },

    addAllItems: function() {
      this.collection.each(this.addItem, this);
    }
  });

})();
