import React, { Component } from 'react';
import playerjs from 'player.js';


import transcript from './transcript';
import './TranscriptPlayer.css';


class TranscriptPlayer extends Component {
  constructor(props) {
    super(props);

    this.player = null;
    this.receiver = null;
    this.video = React.createRef();
  }

  setup() {
    this.receiver = new playerjs.Receiver();

    this.player = new playerjs.Player(this.video.current);

    this.receiver.on('play', () => {
      this.player.play();
      this.receiver.emit('play');
    });

    this.receiver.on('pause', () => {
      this.player.pause();
      this.receiver.emit('pause');
    });

    this.receiver.on('getDuration', callback => this.player.getDuration(duration => callback(duration)));
    this.receiver.on('getVolume', callback => this.player.getVolume(volume => callback(volume)));
    this.receiver.on('setVolume', value => this.player.setVolume(value));
    this.receiver.on('mute', () => this.player.mute())
    this.receiver.on('unmute', () => this.player.unmute());
    this.receiver.on('getMuted', callback => this.player.getMuted(mute => callback(mute)));
    this.receiver.on('getPaused', callback => this.player.getPaused(paused => callback(paused)));
    this.receiver.on('getLoop', callback => this.player.getLoop(loop => callback(loop)));
    this.receiver.on('setLoop', value => this.player.setLoop(value));
    this.receiver.on('getCurrentTime', callback => this.player.getCurrentTime(currentTime => callback(currentTime)));
    this.receiver.on('setCurrentTime', value => this.player.setCurrentTime(value));


    this.player.addEventListener('ended', () => this.receiver.emit('ended'));
    this.player.addEventListener('timeupdate', () => this.player.getDuration(duration => this.player.getCurrentTime(seconds => this.receiver.emit('timeupdate', { seconds, duration }))));

    this.receiver.ready();
  }

  componentDidMount() {
    // this.setup();
  }

  render() {
    return (
      <div className="TranscriptPlayer">
        { transcript.words.reduce((acc, word) => {
          if (/[^a-zA-Z0-9]/.test(word.name.split('').pop())) {
            const p = acc.pop();
            p.name += word.name;
            return [...acc, p];
          }
          return [...acc, word];
        }, []).map(word => (<span data-t={word.time} data-d={word.duration}>{word.name} </span>)) }
      </div>
    );
  }
}

export default TranscriptPlayer;
