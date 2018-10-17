import React from "react";
import styled from "styled-components";

// - play/pause
// - playback rate
// - volume
// - progress w/ buffer

const Player = styled.div``;
const PlaybackControls = styled.div``;
const VolumeControls = styled.div``;
const ProgressControls = styled.div``;

const PlayerChrome = props => {
  const { children } = props;
  return (
    <Player>
      <PlaybackControls>Play/Pause</PlaybackControls>
      <ProgressControls>20 / 100</ProgressControls>
      <VolumeControls>1 - 2 - 3 - 4 - 5</VolumeControls>
      {children}
    </Player>
  );
};

PlayerChrome.propTypes = {};

PlayerChrome.defaultProps = {};

export default PlayerChrome;
