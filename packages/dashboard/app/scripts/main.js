/*global haDash, $*/


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

		this.whoami();

		// FUGLY
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
			success: function(whoami) {
				console.log(whoami);

				if (whoami.user) {
					window.haDash.user = whoami.user;
					$('body').removeClass('anonymous').addClass('user');
				} else {
					window.haDash.user = null;
					$('body').removeClass('user').addClass('anonymous');
				}

				if (callback) callback();
			}
		});

	}
};

$(document).ready(function() {
	'use strict';

	haDash.init();

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
