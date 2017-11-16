/*global haDash, $*/
Backbone.emulateJSON = false;
jQuery.timeago.settings.allowFuture = true;

var namespace = null; // default no namespace

if (document.location.hostname.indexOf('hyperaud') > 0) {
  namespace = document.location.hostname.substring(0, document.location.hostname.indexOf('hyperaud') - 1);
}

var protocol = 'http:'; // default protocol
var prefix = ''; // default no prefix
if (namespace) prefix = namespace + '.';

var domain = '127.0.0.1.xip.io:8080'; // default API localhost
if (document.location.hostname.indexOf('hyperaud.io') > -1) {
  domain = 'hyperaud.io'; // PROD
  protocol = window.location.protocol;
} else if (document.location.hostname.indexOf('hyperaudio.net') > -1) {
  domain = 'hyperaudio.net'; // DEV
  protocol = window.location.protocol;
}

window.haDash = {
  lang: 'en',
  namespace: namespace,
  API: protocol + '//' + prefix + 'api.' + domain + '',
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

    // TODO refresh token

    // $.ajax({
    //   url: this.API + '/whoami',
    //   xhrFields: {
    //     withCredentials: true
    //   },
    //   timeout: 5000,
    //   success: function(whoami) {
    //     haDash.setUser(whoami);
    //     if (callback) callback();
    //   }
    // });

    // check if token is still good
    try {
      var token = window.localStorage.getItem('token');
      var payload = JSON.parse(window.atob(token.split('.')[1]));
      var exp = new Date (payload.exp * 1e3);
      $('a.logout').attr('title', 'token expires in ' + $.timeago(exp));
      if (exp.getTime() - new Date().getTime() <= 0){
        console.log("token expired");
        window.localStorage.removeItem('token');
        window.localStorage.removeItem('user');
        haDash.router.navigate('login/', {trigger: true});
      }
    } catch (e) {
      window.localStorage.removeItem('token');
      window.localStorage.removeItem('user');
    }

    if (! window.localStorage.getItem('token')) {
      window.localStorage.removeItem('user');
      haDash.setUser({ user: null });
    } else if (window.localStorage.getItem('user') && window.localStorage.getItem('token')) {
      haDash.setUser({ user: window.localStorage.getItem('user') });
    } else {
      window.localStorage.removeItem('token');
      window.localStorage.removeItem('user');
      haDash.setUser({ user: null });
    }

    if (callback) callback();
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
    // if (!window.socket) return;
    // // window.socket = io.connect('//' + prefix + 'api.' + domain + '/');
    //
    // window.socket.on(haDash.user, function (data) {
    //   console.log(data);
    // });
  },

  socketDisconnect: function () {
    // if (window.socket) haDash.socket.disconnect();
  }
};

$(document).ready(function() {
  'use strict';

  $.ajaxPrefilter( function( options, originalOptions, jqXHR ) {
    if (options.url.indexOf(haDash.API) == 0) {
      // options.xhrFields = {
      //    withCredentials: true
      //  };
      if (window.localStorage.getItem('token')) {
        jqXHR.setRequestHeader('Authorization', 'Bearer ' + window.localStorage.getItem('token'));
      }
    }
    // TBD see http://backbonetutorials.com/cross-domain-sessions/
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

  // TraceKit.report.subscribe(function (errorReport) {
  //   $.ajax({
  //     url: haDash.API + '/error/dashboard',
  //     contentType: "application/json; charset=utf-8",
  //     dataType: "json",
  //     xhrFields: {
  //       withCredentials: true
  //     },
  //     method: 'post',
  //     data: JSON.stringify({
  //       user: haDash.user,
  //       errorReport: errorReport
  //     })
  //   });
  // });

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
