import { shape, string } from "prop-types";
import React from "react";
import styled from "styled-components";

import { Icon } from "../elements";
import { lightThm } from "../themes";

const PlayerChromeEl = styled.div`
  background: ${({ theme }) => theme.background};
`;
const PlaybackControls = styled.div``;
const SpeedControls = styled.div``;
const VolumeControls = styled.div``;

const PlayerChrome = props => {
  const { children } = props;
  return (
    <PlayerChromeEl>
      <PlaybackControls>
        <Icon name="play" /> Play
        <Icon name="pause" /> Pause
      </PlaybackControls>
      <SpeedControls>20 / 100</SpeedControls>
      <VolumeControls>
        <Icon name="volume-mute1" />1 - 2 - 3 - 4 - 5<Icon name="volume-high" />
      </VolumeControls>
      {children}
    </PlayerChromeEl>
  );
};

PlayerChrome.propTypes = {
  theme: shape({
    background: string
  })
};

PlayerChrome.defaultProps = {
  theme: {
    background: lightThm.background
  }
};

export default PlayerChrome;
