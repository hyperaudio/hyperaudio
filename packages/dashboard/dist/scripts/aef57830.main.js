/*global haDash, $*/
Backbone.emulateJSON = false;

window.haDash = {
  API: (document.location.host == '10.0.54.74') ? 'http://10.0.54.74' : 'http://api.hyperaud.io/v1', //FIXME?
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},

  init: function() {
    'use strict';

    this.router = new this.Routers.Router();

    Backbone.history.start({
      pushState: true
    });


    // FUGLY -> TODO create a view?
    $('a.media').click(function(e){
      e.preventDefault();
      haDash.router.navigate('media/', {trigger: true});
    });

    $('a.mixes').click(function(e){
      e.preventDefault();
      haDash.router.navigate('mixes/', {trigger: true});
    });

    $('a.logout').click(function(e){
      e.preventDefault();
      haDash.router.navigate('signout/', {trigger: true});
    });

    $('a.register').click(function(e){
      e.preventDefault();
      haDash.router.navigate('secret-signup/', {trigger: true});
    });

    $('a.login').click(function(e){
      e.preventDefault();
      haDash.router.navigate('secret-signin/', {trigger: true});
    });


  },

  user: null,

  whoami: function(callback) {

    $.ajax({
      url: this.API + '/whoami',
      xhrFields: {
        withCredentials: true
      },
      timeout: 5000,
      success: function(whoami) {
        haDash.setUser(whoami);
        if (callback) callback();
      }
    });

  },

  setUser: function (whoami) {
    if (whoami.user) {
      window.haDash.user = whoami.user;
      $('body').removeClass('anonymous').addClass('user');
      haDash.socketConnect();
    } else {
      window.haDash.user = null;
      $('body').removeClass('user').addClass('anonymous');
      haDash.socketDisconnect();
    }
  },

  socket: null,

  socketConnect: function () {
    // haDash.socket = io.connect('//api.hyperaud.io/');

    // haDash.socket.on(haDash.user, function (data) {
    //   console.log(data);
    // });
  },

  socketDisconnect: function () {
    // if (haDash.socket) haDash.socket.disconnect();
  }
};

$(document).ready(function() {
  'use strict';

  $.ajaxPrefilter( function( options, originalOptions, jqXHR ) {
    if (options.url.indexOf(haDash.API) == 0) {
      options.xhrFields = {
              withCredentials: true
          };
      }
        //FIXME see http://backbonetutorials.com/cross-domain-sessions/
        // If we have a csrf token send it through with the next request
        // if(typeof that.get('_csrf') !== 'undefined') {
        //   jqXHR.setRequestHeader('X-CSRF-Token', that.get('_csrf'));
        // }
    });

    TraceKit.report.subscribe(function (errorReport) {
      $.ajax({
      url: haDash.API + '/error/dashboard',
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      xhrFields: {
        withCredentials: true
      },
      method: 'post',
      data: JSON.stringify({
        user: haDash.user,
        errorReport: errorReport
      })
    });
    });

  haDash.whoami(function(){
    haDash.init();
  });

  $(document).foundation();
});

function applyTooltips() {
  $(document).foundation({
    tooltips: {
      selector : '.has-tip',
      additional_inheritable_classes : [],
      tooltip_class : '.tooltip',
      touch_close_text: 'tap to close',
      disable_for_touch: false,
      tip_template : function (selector, content) {
        return '<span data-selector="' + selector + '" class="' + Foundation.libs.tooltips.settings.tooltipClass.substring(1) + '">' + content + '<span class="nub"></span></span>';
    }}
  });
}

this["JST"] = this["JST"] || {};

this["JST"]["app/scripts/templates/addMedia.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<h2>Add YouTube Video</h2>\n\n<p class="lead">Please paste a link to a video below (YouTube preferably)</p>\n\n<input id="yt" type="text" class="large" placeholder="video link">\n\n<button class="button primary">Add Video</button>\n';

}
return __p
};

this["JST"]["app/scripts/templates/media.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<td class="span1"><img src="';

if (source.youtube && source.youtube.thumbnail) {
  print(_.escape(source.youtube.thumbnail));
}
;
__p += '" class=""></td>\n<td class="span2 label">' +
__e( label ) +
'</td>\n<td class="span4">';

  var shortDesc = desc;
  if (desc.length > 140) shortDesc = desc.substring(0, 140) + '…';
  var lines = shortDesc.split("\n");
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    print(_.escape(line));
    if (i < lines.length - 1) print('<br />');
  }
;
__p += '</td>\n<td class="span2"><span class="timeago" title="' +
__e( modified ) +
'">' +
__e( modified ) +
'</span></td>\n<td>' +
__e( owner ) +
'</td>\n';

}
return __p
};

this["JST"]["app/scripts/templates/mediaDetail.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<h2 class="label editable" data-field="label">' +
__e( label ) +
'</h2>\n\n<p class="lead desc editable" data-field="desc">';

  var lines = desc.split("\n");
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    print(_.escape(line));
    if (i < lines.length - 1) print('<br />');
  }
;
__p += '</p>\n\n<p><input type="hidden" class="tags" value="';

print(tags.join(','));
;
__p += '"></p>\n\n\n<a class="button primary" href="http://hyperaud.io/maker/?m=' +
__e( _id) +
'">Create Transcript</a>\n<a class="button primary" href="http://hyperaud.io/converter/?m=' +
__e( _id) +
'">Convert Transcript</a>\n\n';
 if (owner == haDash.user) { ;
__p += '\n  <button class="button delete">Delete Video</button>\n';
 } ;
__p += '\n\n<p>&nbsp;</p>\n\n<div id="transcripts"></div>\n\n';

}
return __p
};

this["JST"]["app/scripts/templates/mediaList.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="user">\n\n  <button id="addMedia" class="button primary">Add Media</button>\n\n  <p>&nbsp;</p>\n\n  <table>\n    <caption>Your Media</caption>\n    <thead>\n      <tr>\n        <th class="span1"></th>\n        <th class="span2">Title</th>\n        <th class="span4">Description</th>\n        <th class="span2">Date</th>\n        <th>Author</th>\n      </tr>\n    </thead>\n    <tbody class="your"></tbody>\n  </table>\n\n  <p>&nbsp;</p>\n  <p>&nbsp;</p>\n</div>\n\n\n<table>\n  <caption>Recent Media</caption>\n  <thead>\n    <tr>\n      <th class="span1"></th>\n      <th class="span2">Title</th>\n      <th class="span4">Description</th>\n      <th class="span2">Date</th>\n      <th>Author</th>\n    </tr>\n  </thead>\n  <tbody class="other"></tbody>\n</table>\n\n\n\n\n';

}
return __p
};

this["JST"]["app/scripts/templates/mix.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<td class="span1"><img src="http://placekitten.com/g/100/100" class=""></td>\n<td class="span2 label">' +
__e( label ) +
'</td>\n<td class="span4">';

  var shortDesc = desc;
  if (desc.length > 140) shortDesc = desc.substring(0, 140) + '…';
  var lines = shortDesc.split("\n");
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    print(_.escape(line));
    if (i < lines.length - 1) print('<br />');
  }
;
__p += '\n<br>\n<button class="button small details">Details</button>\n</td>\n<td class="span2"><span class="timeago" title="' +
__e( modified ) +
'">' +
__e( modified ) +
'</span></td>\n<td>' +
__e( owner ) +
'</td>\n\n';

}
return __p
};

this["JST"]["app/scripts/templates/mixDetail.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<h2 class="label editable" data-field="label">' +
__e( label ) +
'</h2>\n\n<p class="lead desc editable" data-field="desc">';

  var lines = desc.split("\n");
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    print(_.escape(line));
    if (i < lines.length - 1) print('<br />');
  }
;
__p += '</p>\n\n\n<a class="button primary" href="http://hyperaud.io/pad/?m=' +
__e( _id) +
'">View Mix</a>\n\n';
 if (owner == haDash.user) { ;
__p += '\n  <button class="button delete">Delete Mix</button>\n';
 } ;
__p += '\n\n<p>&nbsp;</p>\n<p>&nbsp;</p>\n\n<table>\n  <caption>Remixed Media</caption>\n  <thead>\n    <tr>\n      <th class="span1"></th>\n      <th class="span2">Title</th>\n      <th class="span4">Used transcript</th>\n      <th class="span2">Date</th>\n      <th>Author</th>\n    </tr>\n  </thead>\n  <tbody></tbody>\n</table>\n';

}
return __p
};

this["JST"]["app/scripts/templates/mixList.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="user">\n\n  <a class="button primary" href="http://hyperaud.io/pad/">Create Mix</a>\n\n  <p>&nbsp;</p>\n\n  <table>\n    <caption>Your Mixes</caption>\n    <thead>\n      <tr>\n        <th class="span1"></th>\n        <th class="span2">Title</th>\n        <th class="span4">Description</th>\n        <th class="span2">Date</th>\n        <th>Author</th>\n      </tr>\n    </thead>\n    <tbody class="your"></tbody>\n  </table>\n\n  <p>&nbsp;</p>\n  <p>&nbsp;</p>\n</div>\n\n<table>\n  <caption>Recent Mixes</caption>\n  <thead>\n    <tr>\n      <th class="span1"></th>\n      <th class="span2">Title</th>\n      <th class="span4">Description</th>\n      <th class="span2">Date</th>\n      <th>Author</th>\n    </tr>\n  </thead>\n  <tbody class="other"></tbody>\n</table>\n';

}
return __p
};

this["JST"]["app/scripts/templates/signIn.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<hgroup class="section-head">\n  <h1 class="section-head-heading">\n    Sign In\n  </h1>\n</hgroup>\n<div class="row">\n  <div class="large-8 medium-8 medium-offset-2 small-12 columns large-offset-2">\n    <form id="loginForm" class="form">\n      <div class="form-component">\n        <label for="username" class="form-label centered">Username</label>\n        <input type="text" name="username" id="username" class="form-input text-input block large centered" placeholder="Username">\n        <!-- <p style="display:none" class="form-alert">Wrong username.</p> -->\n      </div>\n      <div class="form-component">\n        <label for="password" class="form-label centered">Password</label>\n        <input type="password" name="password" id="password" class="form-input text-input block large centered" placeholder="Password">\n        <p id="loginFormError" style="display:none" class="form-alert">\n          Wrong username or password.\n        </p>\n      </div>\n      <div class="form-component actions">\n        <!-- <input id="signin" type="submit" class="button large primary" value="Sign In"> -->\n        <button id="signin" type="submit" class="button large primary"><img src="images/ajax-loader-ffffff-on-808080.gif"> Sign In</button>\n      </div>\n    </form>\n  </div>\n</div>\n';

}
return __p
};

this["JST"]["app/scripts/templates/signUp.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<hgroup class="section-head">\n  <h1 class="section-head-heading">\n    Sign up\n  </h1>\n</hgroup>\n<div class="row">\n  <div class="large-8 medium-8 small-12 columns large-offset-2 medium-offset-2">\n    <form id="registerForm" class="form">\n      <div class="form-component">\n        <label for="username" class="form-label centered">Username</label> <input id="username" type="text" name="username" class="form-input text-input block large centered" placeholder="Username">\n        <p id="registerFormError" style="display:none" class="form-alert">\n          Wrong username.\n        </p>\n      </div>\n      <div class="form-component">\n        <label for="password" class="form-label centered">Password</label> <input id="password" type="password" name="password" class="form-input text-input block large centered" placeholder="Password">\n      </div>\n      <div class="form-component actions">\n        <!-- <input id="signup" type="submit" class="button large primary" value="Sign up"> -->\n        <button id="signup" type="submit" class="button large primary"><img src="images/ajax-loader-ffffff-on-808080.gif"> Sign up</button>\n      </div>\n    </form>\n  </div>\n</div>\n</div>\n';

}
return __p
};

this["JST"]["app/scripts/templates/transcript.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<td class="span1">' +
__e( type ) +
'</td>\n<td class="span2 label"><span class="tLabel editable" data-field="label">' +
__e( label ) +
'</span></td>\n<td class="span3"><span class="tDesc editable" data-field="desc">' +
__e( desc ) +
'</span></td>\n<td class="span1"><span class="timeago" title="' +
__e( modified ) +
'">' +
__e( modified ) +
'</span></td>\n<td>' +
__e( owner ) +
'</td>\n<td>\n  ';
 if (owner == haDash.user) { ;
__p += '\n    ';
 if (type == "text") { ;
__p += '\n    <a class="button small" href="http://hyperaud.io/maker/?t=' +
((__t = ( _id)) == null ? '' : __t) +
'">Edit</a>\n    <button class="button align small primary">Align</button>\n  ';
 } else if (type == "html") { ;
__p += '\n    <a class="button small" href="http://hyperaud.io/cleaner/?t=' +
((__t = ( _id)) == null ? '' : __t) +
'">Clean</a>\n  ';
 } else if (type == "srt") { ;
__p += '\n    <a class="button small primary" href="http://hyperaud.io/converter/?t=' +
((__t = ( _id)) == null ? '' : __t) +
'">Convert</a>\n  ';
 } ;
__p += '\n    <button class="button tDelete">Delete</button>\n  ';
 } else { ;
__p += '\n    <button class="button tClone">Clone</button>\n  ';
 } ;
__p += '\n</td>\n';

}
return __p
};

this["JST"]["app/scripts/templates/transcriptList.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<table class="user">\n  <caption>Your Transcripts</caption>\n  <thead>\n    <tr>\n      <th class="span1"></th>\n      <th class="span2">Title</th>\n      <th class="span3">Description</th>\n      <th class="span1">Date</th>\n      <th>Author</th>\n      <th></th>\n    </tr>\n  </thead>\n  <tbody class="your">\n  </tbody>\n</table>\n\n<p>&nbsp;</p>\n<p>&nbsp;</p>\n\n<table>\n  <caption>Available Transcripts</caption>\n  <thead>\n    <tr>\n      <th class="span1"></th>\n      <th class="span2">Title</th>\n      <th class="span3">Description</th>\n      <th class="span1">Date</th>\n      <th>Author</th>\n      <th></th>\n    </tr>\n  </thead>\n  <tbody class="other">\n  </tbody>\n</table>\n';

}
return __p
};
/*global haDash, Backbone*/

haDash.Models = haDash.Models || {};

(function() {
  'use strict';

  haDash.Models.MixModel = Backbone.Model.extend({

    idAttribute: "_id",

    defaults: function() {
      return {
        label: "",
        desc: "",
        type: "html",
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
        owner: null,
        tags: []
      };
    }

  });

})();

/*global haDash, Backbone*/

haDash.Collections = haDash.Collections || {};

(function() {
  'use strict';

  haDash.Collections.MixCollection = Backbone.Collection.extend({

    model: haDash.Models.MixModel,

    url: function() {
      return haDash.API + '/mixes';
    },

    comparator: function(model) {
         return - new Date(model.get('modified')).getTime();
      }

  });

})();

/*global haDash, Backbone*/

haDash.Routers = haDash.Routers || {};

(function() {
  'use strict';

  var $main = $('#main');

  haDash.Routers.Router = Backbone.Router.extend({
    routes: {
      '': 'dashboard',
      'dashboard/': 'dashboard',
      'mixes/': 'mixes',
      'mixes/:id': 'mixDetail',
      'media/': 'media',
      'media/:id': 'mediaDetail',
      'secret-signin/': 'signin',
      'signout/': 'signout',
      'secret-signup/': 'signup',
      'add-media/': 'addMedia'
    },

    addMedia: function() {
      console.log('ADD MEDIA');
      $main.empty().append(
        new haDash.Views.AddMediaView({
          model: new haDash.Models.MediaModel()
        }).render().el
      );
    },

    dashboard: function() {
      // console.log('Dashboard N/A');
      document.location = '/media/';
    },

    mixes: function() {
      // if (!haDash.mixCollection) {
        haDash.mixCollection = new haDash.Collections.MixCollection();
      // }

      haDash.mixListView = new haDash.Views.MixListView({
        collection: haDash.mixCollection
      });

      $main.empty().append(haDash.mixListView.render().el);
      haDash.mixCollection.fetch();
    },

    media: function() {
      console.log('MEDIA');

      // if (!haDash.mediaCollection) {
        haDash.mediaCollection = new haDash.Collections.MediaCollection();
      // }

      // if (!haDash.mediaListView) {
        haDash.mediaListView = new haDash.Views.MediaListView({
          collection: haDash.mediaCollection
        });
      // }
      $main.empty().append(haDash.mediaListView.render().el);
      haDash.mediaCollection.fetch();

    },

    mediaDetail: function(id) {
      var model = new haDash.Models.MediaModel({_id: id});
      model.fetch({
        url: haDash.API + '/media/' + id + '/meta/probe'
      });

      $main.empty().append(
        new haDash.Views.MediaDetailView({
          model: model
        }).render().el
      );
    },

    mixDetail: function(id) {
      var model = new haDash.Models.MixModel({_id: id});
      model.fetch({
        url: haDash.API + '/mixes/' + id
      });

      $main.empty().append(
        new haDash.Views.MixDetailView({
          model: model
        }).render().el
      );
    },

    signin: function() {
      $main.empty().append(new haDash.Views.SignInView({}).el);
    },

    signout: function() {

      $.ajax({
        url: haDash.API + '/logout',
        contentType: "application/json; charset=utf-8",
          dataType: "json",
        xhrFields: {
          withCredentials: true
        },
        method: 'post',
        data: JSON.stringify({
          _csfr: 'TODO'
        }),
        success: function() {
              haDash.whoami(function() {
                haDash.router.navigate("mixes/", {trigger: true});
              });
        }
      });

    },

    signup: function() {
      $main.empty().append(new haDash.Views.SignUpView({}).el);
    }

  });

})();

/*global haDash, Backbone, JST*/

haDash.Views = haDash.Views || {};

(function() {
  'use strict';

  haDash.Views.MixView = Backbone.View.extend({

    tagName: 'tr',

    template: JST['app/scripts/templates/mix.ejs'],

    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.$el.find("span.timeago").timeago();

      this.$el.data('view', this);
      this.$el.data('model', this.model);
      return this;
    },

    events: {
      "click td": "openPad",
      "click button.details": "mixDetail"
    },

    openPad: function() {
      document.location = "http://hyperaud.io/pad/?m=" + this.model.id;
    },

    mixDetail: function(event) {
      event.stopPropagation();
      haDash.router.navigate("mixes/" + this.model.id, {trigger: true});
    }
  });

})();

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

      if (haDash.user == item.get('owner')) {
        this.$('tbody.your').append(view.render().el);
      } else {
        this.$('tbody.other').append(view.render().el);
      }
    },

    addAllItems: function() {
      this.collection.each(this.addItem, this);
    }
  });

})();

/*global haDash, Backbone, JST*/

haDash.Views = haDash.Views || {};

(function () {
  'use strict';

  haDash.Views.SignInView = Backbone.View.extend({

    id: 'signInView',

        template: JST['app/scripts/templates/signIn.ejs'],

    initialize: function() {
      this.render();
    },

    render: function() {
      this.$el.html(this.template());

      return this;
    },

    events: {
      'click #loginForm button[type="submit"]': 'signin'
    },

    signin: function(event) {
      event.preventDefault();
      $('#loginFormError').hide();
      $(event.target).find('img').show();

      $.ajax({
        url: haDash.API + '/login',
        contentType: "application/json; charset=utf-8",
          dataType: "json",
        xhrFields: {
          withCredentials: true
        },
        method: 'post',
        data: JSON.stringify({
              username: $('#username').val(),
              password: $('#password').val()
          })
      })
      .done(function(whoami) {
        console.log(whoami);
        haDash.setUser(whoami);
        if (whoami.user) {
          haDash.router.navigate("mixes/", {trigger: true});
        }
      })
      .fail(function() {
        $('#loginFormError').show();
        $(event.target).find('img').hide();
      });

    }
  });

})();

/*global haDash, Backbone, JST*/

haDash.Views = haDash.Views || {};

(function () {
    'use strict';

    haDash.Views.SignUpView = Backbone.View.extend({

    id: 'signUpView',

        template: JST['app/scripts/templates/signUp.ejs'],

    initialize: function() {
      this.render();
    },

    render: function() {
      this.$el.html(this.template());

      return this;
    },

    events: {
      'click #registerForm button[type="submit"]': 'signup'
    },

    signup: function(event) {
      event.preventDefault();
      $('#registerFormError').hide();
      $(event.target).find('img').show();

      $.ajax({
        url: haDash.API + '/register',
        contentType: "application/json; charset=utf-8",
          dataType: "json",
        xhrFields: {
          withCredentials: true
        },
        method: 'post',
        data: JSON.stringify({
              username: $('#username').val(),
              password: $('#password').val()
          })
      })
      .done(function(whoami) {
        console.log(whoami);
        //FIXME in API login person directly
        haDash.router.navigate("secret-signin/", {trigger: true});
        alert('Marvelous, now please log in');
        })
        .fail(function() {
            $('#registerFormError').show();
            $(event.target).find('img').hide();
        });

    }

    });

})();

/*global haDash, Backbone*/

haDash.Models = haDash.Models || {};

(function() {
  'use strict';

  haDash.Models.MediaModel = Backbone.Model.extend({

      idAttribute: "_id",

      defaults: function() {
        return {
          label: "",
          desc: "",
          type: "video",
          owner: null,
          source: {},
          created: new Date().toISOString(),
          modified: new Date().toISOString(),
          tags: []
        };
      }
  });

})();

/*global haDash, Backbone*/

haDash.Collections = haDash.Collections || {};

(function () {
    'use strict';

    haDash.Collections.MediaCollection = Backbone.Collection.extend({

        model: haDash.Models.MediaModel,

    url: function() {
      return haDash.API + '/media';
    },

    comparator: function(model) {
         return - new Date(model.get('modified')).getTime();
      }

    });

})();

/*global haDash, Backbone, JST*/

haDash.Views = haDash.Views || {};

(function () {
    'use strict';

    haDash.Views.MediaView = Backbone.View.extend({

    tagName: 'tr',

        template: JST['app/scripts/templates/media.ejs'],

    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.$el.find("span.timeago").timeago();

      this.$el.data('view', this);
      this.$el.data('model', this.model);
      return this;
    },

    events: {
      'click td': 'mediaDetail'
    },

    mediaDetail: function() {
      haDash.router.navigate("media/" + this.model.id, {trigger: true});
    }

    });

})();

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
      var view = new haDash.Views.MediaView({
        model: item
      });

      if (haDash.user == item.get('owner')) {
        this.$el.find('tbody.your').append(view.render().el);
      } else {
        this.$el.find('tbody.other').append(view.render().el);
      }
    },

    addAllItems: function() {
      // console.log('media adding all items: ' + this.collection.length);
      this.collection.each(this.addItem, this);
    },

    events: {
      'click #addMedia': 'addMedia'
    },

    addMedia: function() {
      haDash.router.navigate("add-media/", {trigger: true});
      // var view = this;
      // this.$el.slideUp(200, function(){
      //  view.remove();
      // });
      this.remove();
    }

    });

})();

/*global haDash, Backbone, JST*/

haDash.Views = haDash.Views || {};

(function () {
    'use strict';

    haDash.Views.MediaDetailView = Backbone.View.extend({

    id: 'mediaDetail',

        template: JST['app/scripts/templates/mediaDetail.ejs'],

    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));

      // var transcriptIDs = this.model.get('transcripts');
      var transcripts = new haDash.Collections.TranscriptCollection();

      // for (var i = 0; i < transcriptIDs.length; i++) {
      //   var transcriptID = transcriptIDs[i];
      //   var transcript = new haDash.Models.TranscriptModel({_id: transcriptID});
      //   transcript.fetch({
      //     url: haDash.API + '/transcripts/' + transcriptID
      //   });
      //   transcripts.add(transcript);
      // }

      var locked = this.notMutable();

      this.$el.find('.tags').select2({
        readonly: locked,
        tags:[],
        tokenSeparators: [",", " "]
      });

      this.$el.find("#transcripts").empty().append(
        new haDash.Views.TranscriptListView({
          collection: transcripts
        }).render().el
      );

      transcripts.fetch({
        url: haDash.API + '/media/' + this.model.id + '/transcripts'
      });

      this.$el.data('view', this);
      this.$el.data('model', this.model);
      return this;
    },

    events: {
      "click h2.label, p.desc": "edit",
      "blur h2.label, p.desc": "save",
      "click button.delete": "delete",
      "change .tags": "saveTags"
    },

    notMutable: function() {
      return this.model.get('owner') != haDash.user;
    },

    edit: function(event) {
      if (this.notMutable()) return;
      $(event.target).attr('contenteditable', true).trigger('focus');
    },

    save: function(event) {
      if (this.notMutable()) return;
      $(event.target).attr('contenteditable', false);
      this.model.set($(event.target).data('field'), $(event.target).text().trim());
      this.model.save(null, {
        url: haDash.API + '/media/' + this.model.id
      });
    },

    delete: function() {
      if (this.notMutable()) return;
      this.model.destroy({
        url: haDash.API + '/media/' + this.model.id
      });
      haDash.router.navigate("/media/", {trigger: true});
    },

    saveTags: function() {
      console.log('tag event');
    }

    });

})();


/*global haDash, Backbone, JST*/

haDash.Views = haDash.Views || {};

(function () {
    'use strict';

    haDash.Views.AddMediaView = Backbone.View.extend({

    id: 'addMediaView',

        template: JST['app/scripts/templates/addMedia.ejs'],

    initialize: function() {
      // this.listenTo(this.model, 'change', this.render);
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));

      // this.$el.foundation('reveal', 'open');

      return this;
    },

    events: {
      "click button": "addVideo"
    },

    //https://gist.github.com/takien/4077195
    YouTubeGetID: function (url){
      var ID = '';
      url = url.replace(/(>|<)/gi,'').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
      if(url[2] !== undefined) {
        ID = url[2].split(/[^0-9a-z_-]/i);
        ID = ID[0];
      }
      else {
        ID = null;
      }
      return ID;
    },

    addVideo: function() {
      if (!haDash.user) {
        haDash.router.navigate("secret-signin/", {trigger: true});
        this.remove();
      }

      var url = this.$el.find('input').val();
      var ytID = this.YouTubeGetID(url);


      var model = this.model;
      var view = this;

      if (ytID) {
        $.ajax({
          url: "http://gdata.youtube.com/feeds/api/videos/" + ytID + "?v=2&alt=json",
          success: function(ytData) {
            console.log(ytData);

            //clean yt json
            var cleanYtData = {};

            function ytClone(destination, source) {
              for (var property in source) {
                var prop = property.replace(/\$/g, '_');
                if (typeof source[property] === "object" &&
                 source[property] !== null ) {
                  destination[prop] = destination[prop] || {};
                  ytClone(destination[prop], source[property]);
                } else {
                  destination[prop] = source[property];
                }
              }
              return destination;
            };

            ytClone(cleanYtData, ytData);

            // model.set('created', haDash.user);
            model.set('owner', haDash.user);
            model.set('label', ytData.entry.title["$t"]);
            model.set('desc', ytData.entry["media$group"]["media$description"]["$t"]);
            model.set('meta', {
              "youtube": cleanYtData
            });
            model.set('source', {
              "youtube": {
                    "type": "video/youtube",
                    "url": "http://www.youtube.com/watch?v=" + ytID,
                    "thumbnail": ytData.entry["media$group"]["media$thumbnail"][0].url
               }
            });

            console.log(model);

            haDash.mediaListView.collection.add(model);

            model.save(null, {
              success: function() {
                haDash.router.navigate("media/", {trigger: true});
                view.remove();
              }
            });

          }
        });
      } else {
        // non YT, hope for the best
        model.set('owner', haDash.user);
        model.set('label', 'n/a');
        model.set('desc', url);
        model.set('meta', {});
        model.set('source', {
          "unknown": {
            "url": url
          }
        });

        console.log(model);

        haDash.mediaListView.collection.add(model);

        model.save(null, {
          success: function() {
            haDash.router.navigate("media/", {trigger: true});
            view.remove();
          }
        });
      }
    }

    });

})();

/*
          label: "Empty",
          desc: "no content",
          type: "text",
          // sort: 0,
          owner: null,
          meta: {},
          transcripts: []
*/

/*global haDash, Backbone*/

haDash.Models = haDash.Models || {};

(function () {
    'use strict';

    haDash.Models.TranscriptModel = Backbone.Model.extend({

        idAttribute: "_id",

      defaults: function() {
        return {
          label: "Empty",
          desc: "",
          type: "text",
          owner: null,
          created: new Date().toISOString(),
          modified: new Date().toISOString(),
          media: null
        };
      }
    });

})();

/*global haDash, Backbone*/

haDash.Collections = haDash.Collections || {};

(function () {
    'use strict';

    haDash.Collections.TranscriptCollection = Backbone.Collection.extend({

      model: haDash.Models.TranscriptModel,

      // url: function() {
      //  return haDash.API + '/transcripts';
      // },

      comparator: function(model) {
         return - new Date(model.get('modified')).getTime();
      }

    });

})();

/*global haDash, Backbone, JST*/

haDash.Views = haDash.Views || {};

(function () {
    'use strict';

    haDash.Views.TranscriptView = Backbone.View.extend({

        tagName: 'tr',

        template: JST['app/scripts/templates/transcript.ejs'],

    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.$el.find("span.timeago").timeago();

      this.$el.data('view', this);
      this.$el.data('model', this.model);
      return this;
    },

    events: {
      "click .tLabel, tDesc": "edit",
      "blur .tLabel, .tDesc": "save",
      "click .align": "align",
      "click .tDelete": "delete",
      "click .tClone": "clone"
    },

    notMutable: function() {
      return this.model.get('owner') != haDash.user;
    },

    edit: function(event) {
      if (this.notMutable()) return;
      $(event.target).attr('contenteditable', true);
    },

    save: function(event) {
      if (this.notMutable()) return;
      $(event.target).attr('contenteditable', false);

      this.model.set($(event.target).data('field'), $(event.target).text().trim());
      this.model.save(null, {
        url: haDash.API + '/transcripts/' + this.model.id
      });
    },

    clone: function() {
      if (!haDash.user) {
        haDash.router.navigate("secret-signin/", {trigger: true});
        this.remove();
      }

      var transcript = this.model.clone();
      transcript.set({
        label: 'clone of ' + transcript.get('label'),
        owner: haDash.user
      });
      transcript.unset('_id');

      transcript.save(null, {
        url: haDash.API + '/transcripts'
      });

      //TODO use it in success above
      $('#mediaDetail').data('view').render();

    },

    align: function() {
      if (!haDash.user) {
        haDash.router.navigate("secret-signin/", {trigger: true});
        this.remove();
      }

      $.ajax({
        url: haDash.API + '/transcripts/' + this.model.id + '/align',
        contentType: "application/json; charset=utf-8",
          dataType: "json",
        xhrFields: {
          withCredentials: true
        },
        method: 'post',
        data: JSON.stringify({})
      })
      .done(function() {
        console.log('OK');
        })
        .fail(function() {
            console.log('ERR');
        });
    },

    delete: function() {
      if (this.notMutable()) return;

      this.model.destroy({
        url: haDash.API + '/transcripts/' + this.model.id
      });

      //TODO use it in success above
      $('#mediaDetail').data('view').render();
    }

    });

})();

/*global haDash, Backbone, JST*/

haDash.Views = haDash.Views || {};

(function () {
    'use strict';

    haDash.Views.TranscriptListView = Backbone.View.extend({

    id: 'transcriptListView',

        template: JST['app/scripts/templates/transcriptList.ejs'],

    initialize: function() {
      console.log("transcriptListView init");

      this.listenTo(this.collection, 'add', this.addItem);
      this.listenTo(this.collection, 'reset', this.render);
      this.listenTo(this.collection, 'sort', this.render);
      this.listenTo(this.collection, 'change', this.render);
    },

    render: function() {
      // console.log("transcriptListView render");

      this.$el.html(this.template());
      this.addAllItems();

      this.$el.data('view', this);
      this.$el.data('collection', this.collection);
      return this;
    },


    addItem: function(item) {
      var view = new haDash.Views.TranscriptView({
        model: item
      });

      // this.$el.find('tbody').append(view.render().el);
      // console.log(haDash.user + ' vs ' + item.get('owner'));
      if (haDash.user == item.get('owner')) {
        // console.log('t your');
        this.$el.find('tbody.your').append(view.render().el);
      } else {
        // console.log('t other');
        this.$el.find('tbody.other').append(view.render().el);
      }
    },

    addAllItems: function() {
      this.collection.each(this.addItem, this);
    }

    });

})();

/*global haDash, Backbone, JST*/

haDash.Views = haDash.Views || {};

(function () {
    'use strict';

    haDash.Views.MixDetailView = Backbone.View.extend({

      id: 'mixDetail',

      template: JST['app/scripts/templates/mixDetail.ejs'],

      initialize: function() {
        this.listenTo(this.model, 'change', this.render);
      },

      render: function() {
        this.$el.html(this.template(this.model.toJSON()));

        // var mediaIDs = [];//this.model.get('transcripts');
        // var mediaCollection = new haDash.Collections.MediaCollection();

        var _this = this;

        $($.parseHTML(this.model.get('content'))).find('[data-id]').each(
          function(i,e){
            var mediaID = $(e).attr('data-id');
            var text = $(e).text();
            var mediaModel = new haDash.Models.MediaModel({_id: mediaID});
            mediaModel.fetch({
              url: haDash.API + '/media/' + mediaID,
              success: function() {
                console.log(text);
                mediaModel.set({desc: text});
              }
            });

            var mediaView = new haDash.Views.MediaView({
              model: mediaModel
            });

            _this.$el.find('tbody').append(mediaView.render().el);
          }
        );

        // for (var i = 0; i < mediaIDs.length; i++) {
        //   var mediaID = mediaIDs[i];

        //   var mediaModel = new haDash.Models.MediaModel({_id: mediaID});
        //   mediaModel.fetch({
        //     url: haDash.API + '/media/' + mediaID
        //   });

        //   var mediaView = new haDash.Views.MediaView({
        //     model: mediaModel
        //   });

        //   this.$el.find('tbody').append(mediaView.render().el);
        // }


        this.$el.data('view', this);
        this.$el.data('model', this.model);
        return this;
      },

      events: {
        "click h2.label, p.desc": "edit",
        "blur h2.label, p.desc": "save",
        "click button.delete": "delete"
      },

      notMutable: function() {
        return this.model.get('owner') != haDash.user;
      },

      edit: function(event) {
        if (this.notMutable()) return;
        $(event.target).attr('contenteditable', true).trigger('focus');
      },

      save: function(event) {
        if (this.notMutable()) return;
        $(event.target).attr('contenteditable', false);
        this.model.set($(event.target).data('field'), $(event.target).text().trim());
        this.model.save(null, {
          url: haDash.API + '/mixes/' + this.model.id
        });
      },

      delete: function() {
        if (this.notMutable()) return;
        this.model.destroy({
          url: haDash.API + '/mixes/' + this.model.id
        });
        haDash.router.navigate("/mixes/", {trigger: true});
      }

    });

})();
