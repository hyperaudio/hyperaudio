import { bool, shape, string } from "prop-types";
import React from "react";
import styled, { ThemeProvider } from "styled-components";

import { font } from "@hyperaudio/ui/settings";
import { Action, Icon } from "@hyperaudio/ui/elements";
import { lightThm } from "@hyperaudio/ui/themes";
import { reset, setHeight, setSpace, setType } from "@hyperaudio/ui/mixins";

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
const Progress = styled.div`
  ${reset};
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
  const { children, conditions, theme } = props;
  const { isPlaying } = conditions;
  return (
    <ThemeProvider theme={theme}>
      <Chrome>
        <Controls>
          <Playback>
            {isPlaying ? (
              <Action>
                <Icon name="pause" /> Pause
              </Action>
            ) : (
              <Action>
                <Icon name="play" /> Play
              </Action>
            )}
          </Playback>
          <Speed>20 / 100</Speed>
          <Progress>20 / 100</Progress>
          <Volume>
            <Icon name="volume-mute1" />
            20 / 100
            <Icon name="volume-high" />
          </Volume>
        </Controls>
        <Canvas>{children}</Canvas>
      </Chrome>
    </ThemeProvider>
  );
};

PlayerChrome.propTypes = {
  conditions: {
    isPlaying: bool
  },
  theme: shape({
    background: string,
    decorColor: string
  })
};

PlayerChrome.defaultProps = {
  conditions: {
    isPlaying: null
  },
  theme: {
    background: lightThm.background,
    decorColor: lightThm.decorColor
  }
};

export default PlayerChrome;
