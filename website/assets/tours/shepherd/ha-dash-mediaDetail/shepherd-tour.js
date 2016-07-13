(function() {
  var uniqueCookieId = "hyperaudio-dash-mediaDetail-hint=true";
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
      text: ['Manage an audio and video file from here.'],
      attachTo: '#mediaDetail',
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
      text: 'Edit the title ...',
      attachTo: '#titleLabel',
      buttons: [
        {
          text: 'Back',
          classes: 'shepherd-button-secondary',
          action: shepherd.back
        }, {
          text: 'Next',
          action: shepherd.next
        }
      ]
    });
    shepherd.addStep('two', {
      text: '... or the description.',
      attachTo: '#descLabel',
      buttons: [
        {
          text: 'Back',
          classes: 'shepherd-button-secondary',
          action: shepherd.back
        }, {
          text: 'Next',
          action: shepherd.next
        }
      ]
    });
    shepherd.addStep('three', {
      text: 'Preview your audio or video.',
      attachTo: '#mediaDetail',
      buttons: [
        {
          text: 'Back',
          classes: 'shepherd-button-secondary',
          action: shepherd.back
        }, {
          text: 'Next',
          action: shepherd.next
        }
      ]
    });
    shepherd.addStep('four', {
      text: 'You can assign a channel to group your media under ...',
      attachTo: '.channels',
      buttons: [
        {
          text: 'Back',
          classes: 'shepherd-button-secondary',
          action: shepherd.back
        }, {
          text: 'Next',
          action: shepherd.next
        }
      ]
    });
    shepherd.addStep('five', {
      text: '... or associated tags with it.',
      attachTo: '.tags',
      buttons: [
        {
          text: 'Back',
          classes: 'shepherd-button-secondary',
          action: shepherd.back
        }, {
          text: 'Next',
          action: shepherd.next
        }
      ]
    });
    shepherd.addStep('six', {
      text: "If you've transcribed some content you can 'Align', 'Edit' or 'Delete' them. Once aligned you can remix. Note alignment can take up to an hour for longer files.",
      attachTo: '.your',
      buttons: [
        {
          text: 'Back',
          classes: 'shepherd-button-secondary',
          action: shepherd.back
        }, {
          text: 'Next',
          action: shepherd.next
        }
      ]
    });
    shepherd.addStep('seven', {
      text: "If somebody else has transcribed the content, you can make a copy and it becomes yours to play with.",
      attachTo: '.your',
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
