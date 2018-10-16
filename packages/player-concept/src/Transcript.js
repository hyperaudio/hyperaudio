import React, { Component } from 'react';
import playerjs from 'player.js';


import transcript from './transcript';
import './Transcript.css';


class Transcript extends Component {
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
    this.setup();
  }

  render() {
    return (
      <div className="Player">
        <iframe ref={this.video} src="http://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fplayer.vimeo.com%2Fvideo%2F125021045%3Fapp_id%3D122963&dntp=1&url=https%3A%2F%2Fvimeo.com%2F125021045&image=https%3A%2F%2Fi.vimeocdn.com%2Fvideo%2F514964564_1280.jpg&key=3ee528c9eb4b4908b268ce1ace120c92&type=text%2Fhtml&schema=vimeo" scrolling="no" allow="autoplay; fullscreen" allowfullscreen="true" frameborder="0"></iframe>
      </div>
    );
  }
}

export default Transcript;
