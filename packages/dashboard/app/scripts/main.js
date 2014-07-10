/*global haDash, $*/
Backbone.emulateJSON = false;


var namespace = null;
// var namespace = 'mozilla';

if (document.location.hostname.indexOf('hyperaud') > 0) {
  namespace = document.location.hostname.substring(0, document.location.hostname.indexOf('hyperaud') - 1);
}

var prefix = '';
if (namespace) prefix = namespace + '.';

var stage;
stage ='api.hyperaudio.net/v1';

window.haDash = {
  
  namespace: namespace,

  // API: (document.location.host.indexOf('10.0.54.74') > 0) ? 'http://' + prefix + 'api.hyperaud.io.10.0.54.74.xip.io' : 'http://' + prefix + stage?stage:'api.hyperaud.io/v1',
  // API: 'http://' + prefix + stage,
  API: 'http://' + prefix + 'api.hyperaud.io/v1',
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},

  init: function() {
    'use strict';

    // this.namespace = 'foo';

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

    // $('a.register').click(function(e){
    //   e.preventDefault();
    //   haDash.router.navigate('secret-signup/', {trigger: true});
    // });

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
