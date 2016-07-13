(function() {
  var uniqueCookieId = "hyperaudio-dash-mixList-hint=true";
  var init, setupShepherd;

  init = function() {
    return setupShepherd();
  };

  setupShepherd = function() {
    var shepherd;

    // set the cookie

    document.cookie = uniqueCookieId;

    shepherd = new Shepherd.Tour({
      defaults: {
        classes: 'shepherd-element shepherd-open shepherd-theme-arrows',
        showCancelLink: true
      }
    });
    shepherd.addStep('welcome', {
      text: ['The mix page displays all remixed audio and video, starting with your own. Click on the items to view them.'],
      
      attachTo: '.nochannel',
      classes: 'shepherd shepherd-open shepherd-theme-arrows shepherd-transparent-text',
      buttons: [
        {
          text: 'Exit',
          classes: 'shepherd-button-secondary',
          action: shepherd.cancel
        }, {
          text: 'Next',
          action: shepherd.next,
          classes: 'shepherd-button-example-primary'
        }
      ]
    });
    shepherd.addStep('one', {
      text: 'Remix media using the "Create Mix" button.',
      attachTo: '#createMix',
      buttons: [
        {
          text: 'Back',
          classes: 'shepherd-button-secondary',
          action: shepherd.back
        }, {
          text: 'Done',
          action: shepherd.next
        }
      ]
    });

    return shepherd.start();
  };

  if (document.cookie.indexOf(uniqueCookieId) < 0) {
    $(init);
  }

}).call(this);
