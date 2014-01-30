/*global haDash, Backbone, JST*/

haDash.Views = haDash.Views || {};

(function () {
    'use strict';

    haDash.Views.MediaListView = Backbone.View.extend({

    id: 'mediaListView',

        template: JST['app/scripts/templates/mediaList.ejs'],

    initialize: function() {
      // this.render();
      // this.addAllItems();

      this.listenTo(this.collection, 'add', this.addItem);
      this.listenTo(this.collection, 'reset', this.render);
      this.listenTo(this.collection, 'sort', this.render);

      // this.collection.fetch();
    },

    render: function() {
      this.$el.html(this.template());
      // this.afterRender();
      this.addAllItems();

      this.$el.data('view', this);
      this.$el.data('collection', this.collection);
      return this;
    },

    // afterRender: function() {

    // },

    addItem: function(item) {
      // console.log('media adding items: ' + item.get('_id'));

      // hide bgm user
      if (item.get('owner') == 'bgm') return;

      var view = new haDash.Views.MediaView({
        model: item
      });

      var $tbody;
      var channel = item.get('channel');

      if (!channel || channel == '') {
        channel = "nochannel";
      } else {
        channel = channel.replace(' ', '_');
      }

      if (haDash.user == item.get('owner')) {
        $tbody = this.$el.find('.your tbody.' + channel);
        if ($tbody.length == 0) {
          var $table = $(this.$el.find('.your table').get(0));
          // var $clone = $table.clone();
          var $clone = $('<table>' + $table.html() + '</table>');
          $table.after($clone);
          $clone.find('caption').addClass('collapsed').text(channel.replace('_', ' '));
          $clone.find('thead').empty().hide();
          $clone.find('tbody').empty().hide();
          $clone.find('tbody').attr('class', channel);
          $tbody = this.$el.find('.your tbody.' + channel);
        }
      } else {
        $tbody = this.$el.find('.other tbody.' + channel);
        if ($tbody.length == 0) {
          var $table = $(this.$el.find('.other table').get(0));
          // var $clone = $table.clone();
          var $clone = $('<table>' + $table.html() + '</table>');
          $table.after($clone);
          $clone.find('caption').addClass('collapsed').text(channel.replace('_', ' '));
          $clone.find('thead').empty().hide();
          $clone.find('tbody').empty().hide();
          $clone.find('tbody').attr('class', channel);
          $tbody = this.$el.find('.other tbody.' + channel);
        }
      }

      $tbody.append(view.render().el);

    },

    addAllItems: function() {
      // console.log('media adding all items: ' + this.collection.length);
      this.collection.each(this.addItem, this);
    },

    events: {
      'click #addMedia': 'addMedia',
      "click caption.collapsed": "show",
      "click caption.expanded": "hide"
    },

    addMedia: function() {
      haDash.router.navigate("add-media/", {trigger: true});
      // var view = this;
      // this.$el.slideUp(200, function(){
      //  view.remove();
      // });
      this.remove();
    },

    show: function(event) {
      $(event.target).removeClass('collapsed').addClass('expanded');
      $(event.target).parent().find('thead').show();
      $(event.target).parent().find('tbody').slideDown();
    },

    hide: function(event) {
      $(event.target).removeClass('expanded').addClass('collapsed');
      $(event.target).parent().find('thead').hide();
      $(event.target).parent().find('tbody').slideUp();
    }

    });

})();
