import React, { Component } from 'react';
import playerjs from 'player.js';

import './Player.css';

class Player extends Component {
  constructor(props) {
    super(props);

    this.video = React.createRef();
    this.receiver = new playerjs.Receiver();

    this.receiver.on('play', () => {
      this.video.current.play();
      this.receiver.emit('play');
    });

    this.receiver.on('pause', () => {
      this.video.current.pause();
      this.receiver.emit('pause');
    });

    this.receiver.on('getDuration', callback => callback(this.video.current.duration));
    this.receiver.on('getVolume', callback => callback(this.video.current.volume*100));
    this.receiver.on('setVolume', value => this.video.current.volume = (value/100));
    this.receiver.on('mute', () => this.video.current.mute = true)
    this.receiver.on('unmute', () => this.video.current.mute = false);
    this.receiver.on('getMuted', callback => callback(this.video.current.mute));
    this.receiver.on('getPaused', callback => callback(this.video.current.paused));
    this.receiver.on('getLoop', callback => callback(this.video.current.loop));
    this.receiver.on('setLoop', value => this.video.current.loop = value);
    this.receiver.on('getCurrentTime', callback => callback(this.video.current.currentTime));
    this.receiver.on('setCurrentTime', value => this.video.current.currentTime = value);
  }

  componentDidMount() {
    this.video.current.addEventListener('ended', () => this.receiver.emit('ended'));

    this.video.current.addEventListener('timeupdate', () => {
      this.receiver.emit('timeupdate', {
        seconds: this.video.current.currentTime,
        duration: this.video.current.duration
      });
    });

    this.receiver.ready();
  }

  render() {
    return (
      <div className="Player">
        <video ref={this.video} controls src="https://player.vimeo.com/external/120977606.hd.mp4?s=a4e893debe25a954a3110b7e0f054555fac01893&profile_id=113"></video>
      </div>
    );
  }
}

export default Player;
