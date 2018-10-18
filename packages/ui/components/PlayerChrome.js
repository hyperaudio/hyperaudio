import { bool, func, number, shape, string } from "prop-types";
import React from "react";
import styled, { ThemeProvider } from "styled-components";

import { font } from "@hyperaudio/ui/settings";
import { Action, Icon } from "@hyperaudio/ui/elements";
import { lightThm } from "@hyperaudio/ui/themes";
import {
  reset,
  setHeight,
  setWidth,
  setSpace,
  setType
} from "@hyperaudio/ui/mixins";

const Chrome = styled.div`
  ${reset};
  ${setType("x")};
  display: flex;
  flex-direction: column-reverse;
  justify-content: flex-start;
  width: 100%:
`;
const Controls = styled.menu`
  ${reset};
  ${setHeight("l")};
  ${setSpace("phs")};
  ${setSpace("pvx")};
  align-items: center;
  background: ${({ theme }) => theme.background};
  border-color: ${({ theme }) => theme.decorColor};
  border-style: solid;
  border-width: 0 1px 1px 1px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
const Playback = styled.div`
  ${reset};
`;
const Speed = styled.div`
  ${reset};
`;
const Volume = styled.div`
  ${reset};
`;
const VolumeBar = styled.div`
  ${reset};
  ${setWidth("h")};
  background-color: lightgrey;
  height: 3px;
  position: relative;
`;
const VolumeIndicator = styled.div`
  ${reset};
  background-color: black;
  height: 3px;
  width: ${({ volumeValue }) => `${volumeValue}%`};
`;
const Progress = styled.div`
  ${reset};
`;
const ProgressBar = styled.div`
  ${reset};
  ${setWidth("h")};
  background-color: lightgrey;
  height: 3px;
  position: relative;
`;
const ProgressIndicator = styled.div`
  ${reset};
  background-color: black;
  height: 3px;
  width: ${({ progressValue }) => `${progressValue}%`};
`;
const Canvas = styled.div`
  ${reset};
  line-height: 0;
  video,
  iframe {
    ${reset};
    width: 100%;
  }
`;

const PlayerChrome = props => {
  const { children, conditions, handlers, theme } = props;
  const {
    currentTime,
    duration,
    isMute,
    isPlaying,
    speedRate,
    volume
  } = conditions;
  const {
    handlePause,
    handlePlay,
    handleProgressChange,
    handleVolumeChange,
    handleSpeed
  } = handlers;
  const progressValue = (currentTime * 100) / duration;
  return (
    <ThemeProvider theme={theme}>
      <Chrome>
        <Controls>
          <Playback>
            {isPlaying ? (
              <Action onClick={handlePause}>
                <Icon name="pause" /> Pause
              </Action>
            ) : (
              <Action onClick={handlePlay}>
                <Icon name="play" /> Play
              </Action>
            )}
          </Playback>
          <Speed>
            <Action onClick={handleSpeed}>{speedRate}x</Action>
          </Speed>
          <Progress>
            <ProgressBar onClick={handleProgressChange}>
              <ProgressIndicator progressValue={progressValue} />
            </ProgressBar>
          </Progress>
          <Volume>
            <Action onClick={handleVolumeChange}>
              {volume === 0 ? (
                <Icon name="volume-high" />
              ) : (
                <Icon name="volume-mute1" />
              )}
            </Action>
            <VolumeBar onClick={handleVolumeChange}>
              <VolumeIndicator volumeValue={volume} />
            </VolumeBar>
          </Volume>
        </Controls>
        <Canvas>{children}</Canvas>
      </Chrome>
    </ThemeProvider>
  );
};

PlayerChrome.propTypes = {
  handlers: shape({
    handlePause: func,
    handlePlay: func,
    handleProgressChange: func,
    handleSpeed: func,
    handleVolumeChange: func
  }),
  conditions: shape({
    currentTime: number,
    duration: number,
    isMute: bool,
    isPlaying: bool,
    speedRate: number,
    volume: number
  }),
  theme: shape({
    background: string,
    decorColor: string
  })
};

PlayerChrome.defaultProps = {
  handlers: {
    handlePause: null,
    handlePlay: null,
    handleProgressChange: null,
    handleSpeed: null,
    handleVolumeChange: null
  },
  conditions: {
    currentTime: 0,
    duration: 0,
    isMute: null,
    isPlaying: null,
    speedRate: 1,
    volume: 100
  },
  theme: {
    background: lightThm.background,
    decorColor: lightThm.decorColor
  }
};

export default PlayerChrome;
