import React, { useRef, useCallback, useState } from 'react';
import ReactPlayer from 'react-player';

import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { styled } from '@mui/material/styles';

const PREFIX = 'Theatre';
const classes = {
  root: `${PREFIX}`,
  playerWrapper: `${PREFIX}-playerWrapper`,
  player: `${PREFIX}-player`,
};

const Root = styled('div')(({ theme }) => ({
  textAlign: 'center',
  alignItems: 'center',
  display: 'flex',
  flex: '1 0 260px',
  flexFlow: 'column nowrap',
  justifyContent: 'center',
  padding: theme.spacing(2),
  [`& .${classes.playerWrapper}`]: {
    position: 'relative',
    paddingTop: '56.25%' /* Player ratio: 100 / (1280 / 720) */,
    marginBottom: theme.spacing(2),
    maxHeight: '260px',
  },
  [`& .${classes.player}`]: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
}));

export const Theatre = ({ id, media: url, players }) => {
  const ref = useRef();
  const [playing, setPlaying] = useState(false);

  const onPlay = useCallback(() => setPlaying(true), []);
  const onPause = useCallback(() => setPlaying(false), []);
  const onReady = useCallback(() => {
    players.current[id] = ref.current;
  }, [id]);

  return (
    <Root className={classes.root}>
      <Container maxWidth="md">
        <div className={classes.playerWrapper}>
          <ReactPlayer
            className={classes.player}
            width="100%"
            height="100%"
            {...{ ref, url, playing, onReady, onPlay, onPause }}
          />
        </div>
        <div>
          {playing ? (
            <IconButton onClick={() => setPlaying(false)}>
              <PauseIcon />
            </IconButton>
          ) : (
            <IconButton onClick={() => setPlaying(true)}>
              <PlayArrowIcon />
            </IconButton>
          )}
        </div>
      </Container>
    </Root>
  );
};
