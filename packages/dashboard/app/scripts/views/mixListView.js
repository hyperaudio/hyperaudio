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

    renderEmpty: function() {
      this.$el.addClass('loading');
      this.$el.addClass('empty');
      this.$el.html(this.template());
      return this;
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
      var channelHash = channel;

      if (!channel) {
        channel = 'nochannel';
        channelHash = channel;
      } else {
        // channel = channel.replace(' ', '_');
        var shaObj = new jsSHA(channel, 'TEXT');
        channelHash = 'sha1-' + shaObj.getHash('SHA-1', 'HEX');
      }

      if (haDash.user == item.get('owner')) {
        $tbody = this.$el.find('.your tbody.' + channelHash);
        if ($tbody.length == 0) {
          var $table = $(this.$el.find('.your table').get(0));
          var $clone = $table.clone();
          $table.after($clone);
          $clone
            .find('caption')
            .addClass('collapsed')
            .text(channel);
          $clone
            .find('thead')
            .empty()
            .hide();
          $clone
            .find('tbody')
            .empty()
            .hide();
          $clone.find('tbody').attr('class', channelHash);
          $tbody = this.$el.find('.your tbody.' + channelHash);
        }
      } else {
        $tbody = this.$el.find('.other tbody.' + channelHash);
        if ($tbody.length == 0) {
          var $table = $(this.$el.find('.other table').get(0));
          var $clone = $table.clone();
          $table.after($clone);
          $clone
            .find('caption')
            .addClass('collapsed')
            .text(channel);
          $clone
            .find('thead')
            .empty()
            .hide();
          $clone
            .find('tbody')
            .empty()
            .hide();
          $clone.find('tbody').attr('class', channelHash);
          $tbody = this.$el.find('.other tbody.' + channelHash);
        }
      }

      $tbody.append(view.render().el);
    },

    addAllItems: function() {
      this.$el.removeClass('loading');
      if (this.collection.length == 0) {
        this.$el.addClass('empty');
      } else this.$el.removeClass('empty');
      this.collection.each(this.addItem, this);
    },

    events: {
      'click caption.collapsed': 'show',
      'click caption.expanded': 'hide'
    },

    show: function(event) {
      $(event.target)
        .removeClass('collapsed')
        .addClass('expanded');
      $(event.target)
        .parent()
        .find('thead')
        .show();
      $(event.target)
        .parent()
        .find('tbody')
        .slideDown();
    },

    hide: function(event) {
      $(event.target)
        .removeClass('expanded')
        .addClass('collapsed');
      $(event.target)
        .parent()
        .find('thead')
        .hide();
      $(event.target)
        .parent()
        .find('tbody')
        .slideUp();
    }
  });
})();
