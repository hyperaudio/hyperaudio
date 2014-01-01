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
      this.socketConnect();
    } else {
      window.haDash.user = null;
      $('body').removeClass('user').addClass('anonymous');
      this.socketDisconnect();
    }
  },

  socket: null,

  socketConnect: function () {
    this.socket = io.connect('//api.hyperaud.io');

    this.socket.on(this.user, function (data) {
      console.log(data);
    });
  },

  socketDisconnect: function () {
    if (this.socket) this.socket.disconnect();
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
