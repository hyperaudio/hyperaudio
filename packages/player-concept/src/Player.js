/* eslint jsx-a11y/media-has-caption: 0 */
/* eslint jsx-a11y/iframe-has-title: 0 */
/* eslint no-unneeded-ternary: 0 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import playerjs from 'player.js';

import { PlayerChrome } from '@hyperaudio/ui';

class Player extends Component {
  constructor(props) {
    super(props);

    this.player = null;
    this.receiver = null;
    this.media = React.createRef();
  }

  componentDidMount() {
    this.setup();
  }

  setup() {
    this.receiver = new playerjs.Receiver();

    switch (this.media.current.nodeName) {
      case 'IFRAME':
        this.player = new playerjs.Player(this.media.current);

        this.receiver.on('play', () => {
          this.player.play();
          this.receiver.emit('play');
        });

        this.receiver.on('pause', () => {
          this.player.pause();
          this.receiver.emit('pause');
        });

        this.receiver.on('getDuration', callback =>
          this.player.getDuration(duration => callback(duration))
        );
        this.receiver.on('getVolume', callback =>
          this.player.getVolume(volume => callback(volume))
        );
        this.receiver.on('setVolume', value => this.player.setVolume(value));
        this.receiver.on('mute', () => this.player.mute());
        this.receiver.on('unmute', () => this.player.unmute());
        this.receiver.on('getMuted', callback =>
          this.player.getMuted(mute => callback(mute))
        );
        this.receiver.on('getPaused', callback =>
          this.player.getPaused(paused => callback(paused))
        );
        this.receiver.on('getLoop', callback =>
          this.player.getLoop(loop => callback(loop))
        );
        this.receiver.on('setLoop', value => this.player.setLoop(value));
        this.receiver.on('getCurrentTime', callback =>
          this.player.getCurrentTime(currentTime => callback(currentTime))
        );
        this.receiver.on('setCurrentTime', value =>
          this.player.setCurrentTime(value)
        );

        this.player.addEventListener('ended', () =>
          this.receiver.emit('ended')
        );
        this.player.addEventListener('timeupdate', () =>
          this.player.getDuration(duration =>
            this.player.getCurrentTime(seconds =>
              this.receiver.emit('timeupdate', { seconds, duration })
            )
          )
        );
        break;
      default:
        // VIDEO + AUDIO
        this.receiver.on('play', () => {
          this.media.current.play();
          this.receiver.emit('play');
        });

        this.receiver.on('pause', () => {
          this.media.current.pause();
          this.receiver.emit('pause');
        });

        this.receiver.on('getDuration', callback =>
          callback(this.media.current.duration)
        );
        this.receiver.on('getVolume', callback =>
          callback(this.media.current.volume * 100)
        );
        this.receiver.on('setVolume', value => {
          this.media.current.volume = value / 100;
        });
        this.receiver.on('mute', () => {
          this.media.current.mute = true;
        });
        this.receiver.on('unmute', () => {
          this.media.current.mute = false;
        });
        this.receiver.on('getMuted', callback =>
          callback(this.media.current.mute)
        );
        this.receiver.on('getPaused', callback =>
          callback(this.media.current.paused)
        );
        this.receiver.on('getLoop', callback =>
          callback(this.media.current.loop)
        );
        this.receiver.on('setLoop', value => {
          this.media.current.loop = value;
        });
        this.receiver.on('getCurrentTime', callback =>
          callback(this.media.current.currentTime)
        );
        this.receiver.on('setCurrentTime', value => {
          this.media.current.currentTime = value;
        });
        this.media.current.addEventListener('ended', () =>
          this.receiver.emit('ended')
        );
        this.media.current.addEventListener('timeupdate', () =>
          this.receiver.emit('timeupdate', {
            seconds: this.media.current.currentTime,
            duration: this.media.current.duration
          })
        );
    }

    this.receiver.ready();
  }

  renderMedia() {
    const { type, src } = this.props;

    switch (type.split('/')[0]) {
      case 'iframe': // FIXME
        return (
          <iframe
            ref={this.media}
            src="http://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fplayer.vimeo.com%2Fvideo%2F125021045%3Fapp_id%3D122963&dntp=1&url=https%3A%2F%2Fvimeo.com%2F125021045&image=https%3A%2F%2Fi.vimeocdn.com%2Fvideo%2F514964564_1280.jpg&key=3ee528c9eb4b4908b268ce1ace120c92&type=text%2Fhtml&schema=vimeo"
            scrolling="no"
            allow="autoplay; fullscreen"
            allowFullScreen="true"
            frameBorder="0"
          />
        );
      case 'audio':
        return (
          <audio ref={this.media} {...this.props}>
            <source src={src} type={type} />
          </audio>
        );
      case 'video':
        return (
          <video ref={this.media} {...this.props}>
            <source src={src} type={type} />
          </video>
        );
      default:
        return <p>unknown media type</p>;
    }
  }

  render() {
    const { children } = this.props;
    return (
      <>
        <PlayerChrome>
          <div className="Player">
            {children ? children : this.renderMedia()}
          </div>
        </PlayerChrome>
      </>
    );
  }
}

Player.defaultProps = {
  src:
    'https://player.vimeo.com/external/125021045.hd.mp4?s=b9f8ace1d41c11ab5d9f042666a493130ad664c4&profile_id=113',
  controls: true,
  type: 'video/mp4',
  children: null
};

Player.propTypes = {
  src: PropTypes.string,
  type: PropTypes.string,
  controls: PropTypes.bool,
  children: PropTypes.element
};

export default Player;
