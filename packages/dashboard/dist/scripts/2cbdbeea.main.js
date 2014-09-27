/*global haDash, $*/
Backbone.emulateJSON = false;


var namespace = null;
// var namespace = 'mozilla';

if (document.location.hostname.indexOf('hyperaud') > 0) {
  namespace = document.location.hostname.substring(0, document.location.hostname.indexOf('hyperaud') - 1);
}

var prefix = '';
if (namespace) prefix = namespace + '.';

var domain;
if (document.location.hostname.indexOf('hyperaud.io') > -1) {
  domain = 'hyperaud.io';
} else {
  domain = 'hyperaudio.net';
}

window.haDash = {

  lang: 'en',

  namespace: namespace,

  // API: (document.location.host.indexOf('10.0.54.74') > 0) ? 'http://' + prefix + 'api.hyperaud.io.10.0.54.74.xip.io' : 'http://' + prefix + stage?stage:'api.hyperaud.io/v1',
  // API: 'http://' + prefix + stage,
  API: 'http://' + prefix + 'api.' + domain + '/v1',
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

    $('a.login').click(function(e){
      e.preventDefault();
      haDash.router.navigate('login/', {trigger: true});
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

  // socket: null,

  socketConnect: function () {
    if (!window.socket) return;
    // window.socket = io.connect('//' + prefix + 'api.' + domain + '/');

    window.socket.on(haDash.user, function (data) {
      console.log(data);
    });
  },

  socketDisconnect: function () {
    if (window.socket) haDash.socket.disconnect();
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

  $(document).ajaxStart(function(){
    $('body').addClass('ajax');
  });

  $(document).ajaxComplete(function(){
    $('body').removeClass('ajax');
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
__p += '<h2>Add YouTube Video</h2>\n\n<p class="lead">Please paste a link to a video below (YouTube preferably)</p>\n\n<input id="yt" type="text" class="large" placeholder="video link">\n\n<button class="button primary">Add Video</button>\n\n<!-- -->\n';

}
return __p
};

this["JST"]["app/scripts/templates/choosePassword.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<hgroup class="section-head">\n  <h1 class="section-head-heading">\n    Choose a Password\n  </h1>\n</hgroup>\n\n<div class="row">\n  <div class="large-8 medium-8 medium-offset-2 small-12 columns large-offset-2">\n    <form id="passwordForm" class="form">\n      <div class="form-component">\n        <label for="password" class="form-label centered">Password</label>\n        <input type="password" name="password" id="password" class="form-input text-input block large centered" placeholder="Password">\n      </div>\n      <div class="form-component">\n        <label for="password2" class="form-label centered">Retype Password</label>\n        <input type="password" name="password2" id="password2" class="form-input text-input block large centered" placeholder="Retype Password">\n      </div>\n      <div class="form-component actions">\n        <button id="send" type="submit" class="button large primary"><img style="display:none" src="images/ajax-loader-ffffff-on-808080.gif"> Change</button>\n        <p id="passwordFormError" style="display:none" class="form-alert">\n          It looks like your passwords don\'t match. Please re-enter.\n        </p>\n        <p id="passwordFormConfirm" class="form-note text-center" style="display:none">\n          Password changed. Hooray!\n        </p>\n      </div>\n    </form>\n  </div>\n</div>\n<!-- "Choose Life. Choose a job. Choose a career. Choose a family. Choose a fucking big television, choose washing machines, cars, compact disc players and electrical tin openers. Choose good health, low cholesterol, and dental insurance. Choose fixed interest mortgage repayments. Choose a starter home. Choose your friends. Choose leisurewear and matching luggage. Choose a three-piece suite on hire purchase in a range of fucking fabrics. Choose DIY and wondering who the fuck you are on Sunday morning. Choose sitting on that couch watching mind-numbing, spirit-crushing game shows, stuffing fucking junk food into your mouth. Choose rotting away at the end of it all, pissing your last in a miserable home, nothing more than an embarrassment to the selfish, fucked up brats you spawned to replace yourselves. Choose your future. Choose life..." Choose a fucking Password. -->\n';

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
} else if (source.mp4 && source.mp4.thumbnail) {
  print(_.escape(source.mp4.thumbnail));
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
__p += '</p>\n\n<p>Channel: <input type="hidden" class="channels" value="' +
__e( channel ) +
'"></p>\n\n<p>Tags: <input type="hidden" class="tags" value="';

print(tags.join(','));
;
__p += '"></p>\n\n\n<a class="button primary" href="/maker/?m=' +
__e( _id) +
'">Create Transcript</a>\n<a class="button primary" href="/converter/?m=' +
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
__p += '<div class="user your">\n\n  <button id="addMedia" class="button primary">Add Media</button>\n\n  <p>&nbsp;</p>\n\n  <table>\n    <caption>Your Media</caption>\n    <thead>\n      <tr>\n        <th class="span1"></th>\n        <th class="span2">Title</th>\n        <th class="span4">Description</th>\n        <th class="span2">Date</th>\n        <th>Author</th>\n      </tr>\n    </thead>\n    <tbody class="nochannel">\n      <tr class="lone"><td>\n        <div class="spinner dark">\n          <div class="bounce1"></div>\n          <div class="bounce2"></div>\n          <div class="bounce3"></div>\n        </div>\n      </td></tr>\n    </tbody>\n  </table>\n\n  <p>&nbsp;</p>\n  <p>&nbsp;</p>\n</div>\n\n\n<div class="other">\n  <table>\n    <caption>Recent Media</caption>\n    <thead>\n      <tr>\n        <th class="span1"></th>\n        <th class="span2">Title</th>\n        <th class="span4">Description</th>\n        <th class="span2">Date</th>\n        <th>Author</th>\n      </tr>\n    </thead>\n    <tbody class="nochannel">\n      <tr class="lone"><td>\n        <div class="spinner dark">\n          <div class="bounce1"></div>\n          <div class="bounce2"></div>\n          <div class="bounce3"></div>\n        </div>\n      </td></tr>\n    </tbody>\n  </table>\n</div>\n\n\n\n\n';

}
return __p
};

this["JST"]["app/scripts/templates/mix.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<td class="span1"><img src="http://hyperaud.io/assets/images/inserts/tempmixfiller.png" class=""></td>\n<td class="span2 label">' +
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
__p += '</p>\n\n<p>Channel: <input type="hidden" class="channels" value="' +
__e( channel ) +
'"></p>\n\n<p>Tags: <input type="hidden" class="tags" value="';

print(tags.join(','));
;
__p += '"></p>\n\n<a class="button primary" href="/pad/?m=' +
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
__p += '<div class="user your">\n\n  <a class="button primary" href="/pad/">Create Mix</a>\n\n  <p>&nbsp;</p>\n\n  <table>\n    <caption>Your Mixes</caption>\n    <thead>\n      <tr>\n        <th class="span1"></th>\n        <th class="span2">Title</th>\n        <th class="span4">Description</th>\n        <th class="span2">Date</th>\n        <th>Author</th>\n      </tr>\n    </thead>\n    <tbody class="nochannel">\n      <tr class="lone"><td>\n        <div class="spinner dark">\n          <div class="bounce1"></div>\n          <div class="bounce2"></div>\n          <div class="bounce3"></div>\n        </div>\n      </td></tr>\n    </tbody>\n  </table>\n\n  <p>&nbsp;</p>\n  <p>&nbsp;</p>\n</div>\n\n<div class="other">\n<table>\n    <caption>Recent Mixes</caption>\n    <thead>\n      <tr>\n        <th class="span1"></th>\n        <th class="span2">Title</th>\n        <th class="span4">Description</th>\n        <th class="span2">Date</th>\n        <th>Author</th>\n      </tr>\n    </thead>\n    <tbody class="nochannel">\n      <tr class="lone"><td>\n        <div class="spinner dark">\n          <div class="bounce1"></div>\n          <div class="bounce2"></div>\n          <div class="bounce3"></div>\n        </div>\n      </td></tr>\n    </tbody>\n  </table>\n</div>\n';

}
return __p
};

this["JST"]["app/scripts/templates/resetPassword.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<hgroup class="section-head">\n  <h1 class="section-head-heading">\n    Reset Password\n  </h1>\n</hgroup>\n<div class="row">\n  <div class="large-8 medium-8 medium-offset-2 small-12 columns large-offset-2">\n    <form id="passwordForm" class="form">\n      <div class="form-component">\n        <label for="email" class="form-label centered">Email</label> <input id="email" type="text" name="email" class="form-input text-input block large centered" placeholder="Email">\n      </div>\n      <div class="form-component actions">\n        <button id="send" type="submit" class="button large primary"><img style="display:none" src="images/ajax-loader-ffffff-on-808080.gif"> Send</button>\n        <p id="passwordFormError" style="display:none" class="form-alert">\n          It looks like that\'s not a valid email address. Please re-enter.\n        </p>\n        <p id="passwordFormConfirm" class="form-note text-center" style="display:none">\n          Please check your email for instructions on how to change your password. \n        </p>\n      </div>\n    </form>\n  </div>\n</div>\n';

}
return __p
};

this["JST"]["app/scripts/templates/signIn.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<hgroup class="section-head">\n  <h1 class="section-head-heading">\n    Sign In\n  </h1>\n</hgroup>\n<div class="row">\n  <div class="large-8 medium-8 medium-offset-2 small-12 columns large-offset-2">\n    <form id="loginForm" class="form">\n      <div class="form-component">\n        <label for="username" class="form-label centered">Username</label>\n        <input type="text" name="username" id="username" class="form-input text-input block large centered" placeholder="Username">\n        <!-- <p style="display:none" class="form-alert">Wrong username.</p> -->\n      </div>\n      <div class="form-component">\n        <label for="password" class="form-label centered">Password</label>\n        <input type="password" name="password" id="password" class="form-input text-input block large centered" placeholder="Password">\n        <p id="loginFormError" style="display:none" class="form-alert">\n          Incorrect username or password.\n        </p>\n      </div>\n      <div class="form-component actions">\n        <!-- <input id="signin" type="submit" class="button large primary" value="Sign In"> -->\n        <button id="signin" type="submit" class="button large primary"><img src="images/ajax-loader-ffffff-on-808080.gif"> Sign In</button>\n      </div>\n    </form>\n  </div>\n</div>\n';

}
return __p
};

this["JST"]["app/scripts/templates/signUp.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<hgroup class="section-head">\n  <h1 class="section-head-heading">\n    Sign up\n  </h1>\n</hgroup>\n<div class="row">\n  <div class="large-8 medium-8 small-12 columns large-offset-2 medium-offset-2">\n    <form id="registerForm" class="form">\n\n      <div class="form-component">\n        <label for="username" class="form-label centered">Username</label> <input id="username" type="text" name="username" class="form-input text-input block large centered" placeholder="Username">\n        <p id="registerUsernameError" style="display:none" class="form-alert">\n          Sorry, username already exists.\n        </p>\n      </div>\n\n      <div class="form-component">\n        <label for="email" class="form-label centered">Email</label> <input id="email" type="text" name="email" class="form-input text-input block large centered" placeholder="Email">\n        <p id="registerEmailError" style="display:none" class="form-alert">\n          Sorry, somebody has already registered with this email address. <a href="forgotten-password/">Forgotten your password?</a>\n        </p>\n      </div>\n\n      <div class="form-component actions">\n        <!-- <input id="signup" type="submit" class="button large primary" value="Sign up"> -->\n        <button id="signup" type="submit" class="button large primary"><img src="images/ajax-loader-ffffff-on-808080.gif"> Sign up</button>\n      </div>\n    </form>\n  </div>\n</div>\n</div>\n';

}
return __p
};

this["JST"]["app/scripts/templates/transcript.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<td class="span2 label"><span class="tLabel editable" data-field="label">' +
__e( label ) +
'</span></td>\n<td class="span3">\n  <span class="tDesc editable" data-field="desc">' +
__e( desc ) +
'</span>\n</td>\n<td class="span1"><span class="timeago" title="' +
__e( modified ) +
'">' +
__e( modified ) +
'</span></td>\n<td>' +
__e( owner ) +
'</td>\n<td class="span1">\n\n  ';
 if (type == "text" && !status) { ;
__p += '\n    not aligned\n  ';
 } else if (type == "text" && status) { ;
__p += '\n    ' +
__e( status ) +
'\n  ';
 } else if (type == "html") { ;
__p += '\n  aligned\n  ';
 } else if (type == "srt") { ;
__p += '\n  not converted\n  ';
 } else { ;
__p += '\n  n/a\n  ';
 } ;
__p += '\n\n\n</td>\n<td>\n  ';
 if (owner == haDash.user) { ;
__p += '\n\n    ';
 if (type == "text") { ;
__p += '\n\n      ';
 if (status && status != '') { ;
__p += '\n        <button class="button aligning small primary"><img src="images/ajax-loader-ffffff-on-808080.gif"> Aligning</button>\n      ';
 } else { ;
__p += '\n        <select>\n          <option value="en" selected>English</option>\n          <option value="es">Spanish</option>\n          <option value="fr">French</option>\n          <option value="de">German</option>\n        </select>\n        <button class="button align small primary">Align</button>\n        <button class="button aligning small primary" style="display: none"><img src="images/ajax-loader-ffffff-on-808080.gif"> Aligning</button>\n\n        <a class="button small" href="/maker/?t=' +
((__t = ( _id)) == null ? '' : __t) +
'">Edit</a>\n      ';
 } ;
__p += '\n\n\n  ';
 } else if (type == "html") { ;
__p += '\n    <a class="button small primary" href="/pad/viewer/?t=' +
((__t = ( _id)) == null ? '' : __t) +
'" target="_new">View</a>\n    <a class="button small" href="/pad/?t=' +
((__t = ( _id)) == null ? '' : __t) +
'">Mix</a>\n    <a class="button small" href="/cleaner/?t=' +
((__t = ( _id)) == null ? '' : __t) +
'">Clean</a>\n\n\n  ';
 } else if (type == "srt") { ;
__p += '\n    <a class="button small primary" href="/converter/?t=' +
((__t = ( _id)) == null ? '' : __t) +
'">Convert</a>\n\n  ';
 } ;
__p += '\n    <button class="button tDelete">Delete</button>\n\n  ';
 } else { ;
__p += '\n    <a class="button small primary" href="/pad/viewer/?t=' +
((__t = ( _id)) == null ? '' : __t) +
'" target="_new">View</a>\n    <a class="button small" href="/pad/?t=' +
((__t = ( _id)) == null ? '' : __t) +
'">Mix</a>\n    <button class="button tClone">Clone</button>\n\n  ';
 } ;
__p += '\n</td>\n\n\n';

}
return __p
};

this["JST"]["app/scripts/templates/transcriptList.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<table class="user">\n  <caption>Your Transcripts</caption>\n  <thead>\n    <tr>\n      <th class="span2">Title</th>\n      <th class="span3">Description</th>\n      <th class="span1">Date</th>\n      <th>Author</th>\n      <th class="span1">Status</th>\n      <th></th>\n    </tr>\n  </thead>\n  <tbody class="your">\n  </tbody>\n</table>\n\n<p>&nbsp;</p>\n<p>&nbsp;</p>\n\n<table>\n  <caption>Available Transcripts</caption>\n  <thead>\n    <tr>\n      <th class="span2">Title</th>\n      <th class="span3">Description</th>\n      <th class="span1">Date</th>\n      <th>Author</th>\n      <th class="span1">Status</th>\n      <th></th>\n    </tr>\n  </thead>\n  <tbody class="other">\n  </tbody>\n</table>\n';

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
        namespace: window.haDash.namespace,
        tags: [],
        meta: {},
        channel: null
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
    //http://sizeableidea.com/adding-google-analytics-to-your-backbone-js-app/
    initialize: function() {
      this.bind('route', this.pageView);
    },

    routes: {
      '': 'dashboard',
      'dashboard/': 'dashboard',
      'mixes/': 'mixes',
      'mixes/:id': 'mixDetail',
      'media/': 'media',
      'media/:id': 'mediaDetail',

      'signin/': 'signin',
      'login/': 'signin',

      'signout/': 'signout',

      'beta-signup/': 'signup',
      'signup/': 'signup',

      'reset-password/': 'resetPassword',
      'choose-password/': 'choosePassword',
      'token/:token': 'signInToken',

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
      $('.header-navigation a').removeClass('active');
      $('.header-navigation a.mixes').addClass('active');
      document.title = "Hyperaudio Mixes";
      // if (!haDash.mixCollection) {
        haDash.mixCollection = new haDash.Collections.MixCollection();
      // }

      haDash.mixListView = new haDash.Views.MixListView({
        collection: haDash.mixCollection
      });

      $main.empty().append(haDash.mixListView.renderEmpty().el);
      haDash.mixCollection.fetch();
    },

    media: function() {
      $('.header-navigation a').removeClass('active');
      $('.header-navigation a.media').addClass('active');
      document.title = "Hyperaudio Media";
      // console.log('MEDIA');

      // if (!haDash.mediaCollection) {
        haDash.mediaCollection = new haDash.Collections.MediaCollection();
      // }

      // if (!haDash.mediaListView) {
        haDash.mediaListView = new haDash.Views.MediaListView({
          collection: haDash.mediaCollection
        });
      // }
      $main.empty().append(haDash.mediaListView.renderEmpty().el);
      haDash.mediaCollection.fetch();

    },

    mediaDetail: function(id) {
      $('.header-navigation a').removeClass('active');
      $('.header-navigation a.media').addClass('active');
      var model = new haDash.Models.MediaModel({_id: id});
      model.fetch({
        url: haDash.API + '/media/' + id
      });

      $main.empty().append(
        new haDash.Views.MediaDetailView({
          model: model
        }).render().el
      );
    },

    mixDetail: function(id) {
      $('.header-navigation a').removeClass('active');
      $('.header-navigation a.mixes').addClass('active');
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
      $('.header-navigation a').removeClass('active');
      $('.header-navigation a.login').addClass('active');
      document.title = "Hyperaudio Login";
      $main.empty().append(new haDash.Views.SignInView({}).el);
    },

    signout: function() {
      document.title = "Hyperaudio Logout";

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
          // haDash.whoami(function() {
          //   haDash.router.navigate("mixes/", {trigger: true});
          // });
          document.location = '/';
        }
      });

    },

    signup: function() {
      $('.header-navigation a').removeClass('active');
      $('.header-navigation a.register').addClass('active');
      document.title = "Hyperaudio Sign Up";
      $main.empty().append(new haDash.Views.SignUpView({}).el);
    },

    resetPassword: function() {
      $('.header-navigation a').removeClass('active');
      $('.header-navigation a.login').addClass('active');
      document.title = "Hyperaudio Reset Password";
      $main.empty().append(new haDash.Views.ResetPasswordView({}).el);
    },

    choosePassword: function() {
      $('.header-navigation a').removeClass('active');
      $('.header-navigation a.login').addClass('active');
      document.title = "Hyperaudio Choose a Password";
      $main.empty().append(new haDash.Views.ChoosePasswordView({}).el);
    },

    signInToken: function (token) {
      $.ajax({
          url: haDash.API + '/token-login',
          contentType: "application/json; charset=utf-8",
            dataType: "json",
          xhrFields: {
            withCredentials: true
          },
          method: 'post',
          data: JSON.stringify({
            'access-token': token
          })
        })
        .done(function(whoami) {
          console.log(whoami);
          // changePassword();
          haDash.setUser(whoami);
          if (whoami.user) {
            haDash.router.navigate("choose-password/", {trigger: true});
          }
        })
        .fail(function() {
          console.log('error');
        });
    },

    pageView : function(){
      var url = Backbone.history.getFragment();

      if (!/^\//.test(url) && url != "") {
          url = "/" + url;
      }

      if(! _.isUndefined(window._gaq)){
        _gaq.push(['_trackPageview', url]);
      }
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
      document.location = "/pad/?m=" + this.model.id;
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
        channel = "nochannel";
        channelHash = channel;
      } else {
        // channel = channel.replace(' ', '_');
        var shaObj = new jsSHA(channel, "TEXT");
        channelHash = 'sha1-' + shaObj.getHash("SHA-1", "HEX");
      }

      if (haDash.user == item.get('owner')) {
        $tbody = this.$el.find('.your tbody.' + channelHash);
        if ($tbody.length == 0) {
          var $table = $(this.$el.find('.your table').get(0));
          var $clone = $table.clone();
          $table.after($clone);
          $clone.find('caption').addClass('collapsed').text(channel);
          $clone.find('thead').empty().hide();
          $clone.find('tbody').empty().hide();
          $clone.find('tbody').attr('class', channelHash);
          $tbody = this.$el.find('.your tbody.' + channelHash);
        }
      } else {
        $tbody = this.$el.find('.other tbody.' + channelHash);
        if ($tbody.length == 0) {
          var $table = $(this.$el.find('.other table').get(0));
          var $clone = $table.clone();
          $table.after($clone);
          $clone.find('caption').addClass('collapsed').text(channel);
          $clone.find('thead').empty().hide();
          $clone.find('tbody').empty().hide();
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
      "click caption.collapsed": "show",
      "click caption.expanded": "hide"
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
              password: $('#password').val(),
              email: $('#email').val(),
          })
      })
      .done(function(whoami) {
        console.log(whoami);
        haDash.router.navigate("signin/", {trigger: true});
      })
      .fail(function(e) {
        $('.form-alert').hide();
        console.log("e.status="+e.status);
        if (e.status == "401") {
          $('#registerUsernameError').show();
        }

        if (e.status == "409") {
          $('#registerEmailError').show();
        }
        
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
          label: "Not set",
          desc: "Not set",
          type: "video",
          owner: null,
          namespace: window.haDash.namespace,
          source: {},
          created: new Date().toISOString(),
          modified: new Date().toISOString(),
          tags: [],
          meta: {},
          channel: null
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

    renderEmpty: function() {
      this.$el.addClass('loading');
      this.$el.addClass('empty');
      this.$el.html(this.template());
      return this;
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
      var channelHash = channel;

      if (!channel || channel == '') {
        channel = "nochannel";
        channelHash = channel;
      } else {
        var shaObj = new jsSHA(channel, "TEXT");
        channelHash = 'sha1-' + shaObj.getHash("SHA-1", "HEX");
      }

      if (haDash.user == item.get('owner')) {
        $tbody = this.$el.find('.your tbody.' + channelHash);
        if ($tbody.length == 0) {
          var $table = $(this.$el.find('.your table').get(0));
          // var $clone = $table.clone();
          var $clone = $('<table>' + $table.html() + '</table>');
          $table.after($clone);
          $clone.find('caption').addClass('collapsed').text(channel);
          $clone.find('thead').empty().hide();
          $clone.find('tbody').empty().hide();
          $clone.find('tbody').attr('class', channelHash);
          $tbody = this.$el.find('.your tbody.' + channelHash);
        }
      } else {
        $tbody = this.$el.find('.other tbody.' + channelHash);
        if ($tbody.length == 0) {
          var $table = $(this.$el.find('.other table').get(0));
          // var $clone = $table.clone();
          var $clone = $('<table>' + $table.html() + '</table>');
          $table.after($clone);
          $clone.find('caption').addClass('collapsed').text(channel);
          $clone.find('thead').empty().hide();
          $clone.find('tbody').empty().hide();
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
      document.title = "Hyperaudio: " + this.model.get('label');

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

      this.$el.find('.tags').select2({
        // maximumSelectionSize: 1,
        tags:[],
        tokenSeparators: [","]
      });
      if (this.notMutable()) {
        this.$el.find('.tags').select2("readonly", true);
      }

      this.$el.find('.channels').select2({
        maximumSelectionSize: 1,
        tags:[],
        tokenSeparators: [","]
      });
      if (this.notMutable()) {
        this.$el.find('.channels').select2("readonly", true);
      }

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
      "change .tags": "saveTags",
      "change .channels": "saveChannels"
    },

    // refresh: function() {
    //   this.transcripts.fetch({
    //     url: haDash.API + '/media/' + this.model.id + '/transcripts'
    //   });
    // },

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

      if (!confirm('Are you sure you wish to delete this media entry?')) return;

      this.model.destroy({
        url: haDash.API + '/media/' + this.model.id,
        wait: true,
        success: function(model, response, options) {
          console.log(model, response, options);
          haDash.router.navigate("/media/", {trigger: true});
        },
        error: function(model, response, options) {
          console.log('error');
          console.log(model, response, options);
          haDash.router.navigate("/media/", {trigger: true});
        }
      });
    },

    saveTags: function() {
      if (this.notMutable()) return;
      this.model.set('tags', this.$el.find('.tags').select2("val"));
      this.model.save(null, {
        url: haDash.API + '/media/' + this.model.id
      });
    },

    saveChannels: function() {
      if (this.notMutable()) return;
      this.model.set('channel', this.$el.find('.channels').select2("val")[0]);
      this.model.save(null, {
        url: haDash.API + '/media/' + this.model.id
      });
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
        haDash.router.navigate("signin/", {trigger: true});
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

            var title = ytData.entry.title["$t"];
            if (!title || title == "") {
              title = "Untitled";
            }
            model.set('label', title);


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

          },
          error: function(ytData) {
            alert('YouTube API threw an error, the video might not exist, or it is private');
          }
        });
      } else if (url.toLowerCase().indexOf('archive.org') >= 0) {
        console.log('IA detected, trying magic.');


        //var curl = 'http://www.corsproxy.com/' + url.replace('http://', '').replace('https://', '');
        // var curl = 'http://cors.hyperaudio.net/proxy.php?csurl=' + escape(url);
        // $.get(curl, function (page) {
        var curl = haDash.API + '/about';
        $.post(curl, {url: url}, function (page) {

          var title = $(page).filter('meta[property="og:title"]').attr('content');
          var desc = $(page).filter('meta[property="og:description"]').attr('content');
          var thumb = $(page).filter('meta[property="og:image"]').attr('content').replace('https://', 'http://');;
          var video0 = $(page).filter('meta[property="og:video"]').attr('content');
          var ext0 = video0.split('.').pop();

          model.set('owner', haDash.user);
          model.set('label', title);
          model.set('desc', desc);
          model.set('meta', {});

          var source = {};

          if (video0 && ext0) {
            source[ext0] = {
              url: video0
            };
            if (thumb) source[ext0].thumbnail = thumb;
            if (ext0 != 'mp4') {
              source.mp4 = {
                url: video0.replace('.' + ext0, '.mp4'),
                thumbnail: thumb
              };
            }
          } else {
            source.unknown = {
              url: url
            }
          }

          model.set('source', source);

          console.log(model);

          haDash.mediaListView.collection.add(model);

          model.save(null, {
            success: function() {
              haDash.router.navigate("media/", {trigger: true});
              view.remove();
            }
          });
          ////
        });



      } else {
        if (confirm('Cannot recognise this URL as an YouTube or Internet Archive Video; choose [cancel] to abort or [ok] to continue')) {

          var curl = haDash.API + '/about';
          $.post(curl, {url: url}, function (info) {
            console.log(info);
            if (typeof info == 'string') {
              alert('URL points to a page not to a media file');
              return;
            }

            if (info['content-type'].indexOf('video') != 0 && info['content-type'].indexOf('audio') != 0 ) {
              alert('URL points to ' + info['content-type'] + ' which is not to a media file');
              return;
            }

            var source = {};
            var type = info['content-type'].split('/')[1];
            source[type] = url;

            // non YT, hope for the best
            model.set('owner', haDash.user);
            model.set('label', 'n/a');
            model.set('desc', url);
            model.set('meta', {});
            model.set('source', source);

            console.log(model);

            haDash.mediaListView.collection.add(model);

            model.save(null, {
              success: function() {
                haDash.router.navigate("media/", {trigger: true});
                view.remove();
              }
            });

          });//post
        }//confirm

      }//else
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
          // namespace: window.haDash.namespace,
          created: new Date().toISOString(),
          modified: new Date().toISOString(),
          meta: {},
          media: null,
          status: null
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
      console.log('render ' + this.model.get('status'));
      this.$el.html(this.template(this.model.toJSON()));
      this.$el.find("span.timeago").timeago();

      //
      if (this.model.get('status') && this.model.get('status') != '') {
        this.refresh();
      }
      //

      this.$el.data('view', this);
      this.$el.data('model', this.model);
      return this;
    },

    events: {
      "click .tLabel, .tDesc": "edit",
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
        haDash.router.navigate("signin/", {trigger: true});
        this.remove();
      }

      var transcript = this.model.clone();
      transcript.set({
        label: 'clone of ' + transcript.get('label'),
        owner: haDash.user
      });
      transcript.unset('_id');

      transcript.save(null, {
        url: haDash.API + '/transcripts',
        success: function() {
          $('#mediaDetail').data('view').render();
        },
        error: function() {
          //TODO, alert?
          $('#mediaDetail').data('view').render();
        }
      });

      //TODO use it in success above
      // $('#mediaDetail').data('view').render();

    },

    refresh: function() {
      if (this.refreshing) return;

      if (this.model.get('status') == null || !this.model.get('status').alignment) {
        var self = this;
        this.refreshing = setInterval(function() {
          self.model.fetch({
            url: haDash.API + '/transcripts/' + self.model.id + '/poll?salt=' + Math.random(),
            success: function(model) {
              console.log(model);
              // self.render();
              self.refresh();
            }
          });
        }, 2000);
      }
    },

    align: function() {
      if (!haDash.user) {
        haDash.router.navigate("secret-signin/", {trigger: true});
        this.remove();
      }

      this.$el.find('button.align').hide();
      this.$el.find('button.aligning').show();

      var lang = this.$el.find('select').val();
      if (!lang) lang = haDash.lang;

      var self = this;
      $.ajax({
        url: haDash.API + '/transcripts/' + this.model.id + '/align',
        contentType: "application/json; charset=utf-8",
          dataType: "json",
        xhrFields: {
          withCredentials: true
        },
        method: 'post',
        data: JSON.stringify({
          lang: lang
        })
      })
      .done(function() {
          console.log('OK');
          self.refresh();
        })
      .fail(function(jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
        alert("We have trouble aligning your media, your file may be too large or in a format we don't understand. Sorry.");
        self.$el.find('button.align').show();
        self.$el.find('button.aligning').hide();
      });
      // spin
      //$('#mediaDetail').data('view').refresh();
      // spin
    },

    delete: function() {
      if (this.notMutable()) return;

      if (!confirm('Are you sure you wish to delete this transcript?')) return;

      this.model.destroy({
        url: haDash.API + '/transcripts/' + this.model.id,
        success: function() {
          $('#mediaDetail').data('view').render();
        },
        error: function() {
          //TODO, alert?
          $('#mediaDetail').data('view').render();
        }
      });

      //TODO use it in success above
      // $('#mediaDetail').data('view').render();
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
        document.title = "Hyperaudio: " + this.model.get('label');

        this.$el.html(this.template(this.model.toJSON()));

        this.$el.find('.tags').select2({
          tags:[],
          tokenSeparators: [","]
        });

        if (this.notMutable()) {
          this.$el.find('.tags').select2("readonly", true);
        }

        this.$el.find('.channels').select2({
          maximumSelectionSize: 1,
          tags:[],
          tokenSeparators: [","]
        });

        if (this.notMutable()) {
          this.$el.find('.channels').select2("readonly", true);
        }

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
        "click button.delete": "delete",
        "change .tags": "saveTags",
        "change .channels": "saveChannels"
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

        if (!confirm('Are you sure you wish to delete this mix?')) return;

        this.model.destroy({
          url: haDash.API + '/mixes/' + this.model.id
        });
        haDash.router.navigate("/mixes/", {trigger: true});
      },

      saveTags: function() {
        if (this.notMutable()) return;
        this.model.set('tags', this.$el.find('.tags').select2("val"));
        this.model.save(null, {
          url: haDash.API + '/mixes/' + this.model.id
        });
      },

      saveChannels: function() {
        if (this.notMutable()) return;
        this.model.set('channel', this.$el.find('.channels').select2("val")[0]);
        this.model.save(null, {
          url: haDash.API + '/mixes/' + this.model.id
        });
      }

    });

})();

/*global haDash, Backbone, JST*/

haDash.Views = haDash.Views || {};

function validEmail(email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
} 

(function () {
    'use strict';

    haDash.Views.ResetPasswordView = Backbone.View.extend({

    id: 'passwordView',

        template: JST['app/scripts/templates/resetPassword.ejs'],

    initialize: function() {
      this.render();
    },

    render: function() {
      this.$el.html(this.template());

      return this;
    },

    events: {
      'click #passwordForm button[type="submit"]': 'send'
    },

    send: function(event) {
      event.preventDefault();
      $('#passwordFormError').hide();

      if (validEmail($('#email').val())) {
        $(event.target).find('img').show();

        $.ajax({
          url: haDash.API + '/reset-password',
          contentType: "application/json; charset=utf-8",
            dataType: "json",
          xhrFields: {
            withCredentials: true
          },
          method: 'post',
          data: JSON.stringify({
            email: $('#email').val()
          })
        })
        .done(function(whoami) {
          console.log(whoami);
          $('#passwordForm').hide();
          $('#passwordFormConfirm').show();
        })
        .fail(function() {
          $('#passwordFormError').show();
          $(event.target).find('img').hide();
        });

      } else {
        $('#passwordFormError').show();
      }

    }

  });

})();

/*global haDash, Backbone, JST*/

haDash.Views = haDash.Views || {};


(function () {
    'use strict';

    haDash.Views.ChoosePasswordView = Backbone.View.extend({

    id: 'passwordView',

        template: JST['app/scripts/templates/choosePassword.ejs'],

    initialize: function() {
      this.render();
    },

    render: function() {
      this.$el.html(this.template());

      return this;
    },

    events: {
      'click #passwordForm button[type="submit"]': 'change'
    },

    change: function(event) {
      event.preventDefault();
      $('#passwordFormError').hide();

      if ($('#password').val() == $('#password2').val()) {
        $(event.target).find('img').show();

        $.ajax({
          url: haDash.API + '/choose-password',
          contentType: "application/json; charset=utf-8",
            dataType: "json",
          xhrFields: {
            withCredentials: true
          },
          method: 'post',
          data: JSON.stringify({
            password: $('#password').val()
          })
        })
        .done(function(whoami) {
          console.log(whoami);
          $('#passwordForm').hide();
          $('#passwordFormConfirm').show();
        })
        .fail(function() {
          $('#passwordFormError').show();
          $(event.target).find('img').hide();
        });

      } else {
        $('#passwordFormError').show();
      }

    }

  });

})();
