import React, { useRef, useCallback, useState, useEffect } from 'react';
import ReactPlayer from 'react-player';

import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Tooltip from '@mui/material/Tooltip';
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

export const Theatre = ({ media, players }) => {
  const [active, setActive] = useState();
  const [playing, setPlaying] = useState();

  useEffect(() => setActive(media?.[0]?.id), [media]);

  return (
    <Root className={classes.root}>
      <Container maxWidth="md">
        {media?.map(({ id, url }) => (
          <div key={id} className={classes.playerWrapper} style={{ display: active === id ? 'block' : 'none' }}>
            <Player
              key={id}
              active={active === id}
              playing={playing === id}
              media={{ id, url }}
              {...{ players, setActive, setPlaying }}
            />
          </div>
        ))}

        <div>
          {playing ? (
            <IconButton onClick={() => setPlaying(null)}>
              <PauseIcon />
            </IconButton>
          ) : (
            <IconButton onClick={() => setPlaying(active)}>
              <PlayArrowIcon />
            </IconButton>
          )}
        </div>
      </Container>
    </Root>
  );
};

const Player = ({ media: { id, url }, players, active, setActive, playing, setPlaying }) => {
  const ref = useRef();
  const [primed, setPrimed] = useState(false);

  const onReady = useCallback(() => {
    players.current[id] = ref.current;
    if (!primed) {
      setPlaying(id);
      // setActive(id);
    }
  }, [id, primed]);

  const onPlay = useCallback(() => {
    setPlaying(id);
    setActive(id);
    if (!primed) {
      setPrimed(true);
      setPlaying(false);
    }
  }, [id, primed]);

  const onPause = useCallback(() => setPlaying(false), []);

  const onSeek = useCallback(() => {
    console.log('seek', id);
    setActive(id);
  }, [id]);

  const onProgress = useCallback(
    progress => {
      // console.log(progress);
      setActive(id);
    },
    [id],
  );

  return (
    <ReactPlayer
      key={id}
      className={classes.player}
      width="100%"
      height="100%"
      muted={!primed}
      {...{ ref, url, playing, onReady, onPlay, onPause, onSeek, onProgress }}
    />
  );
};
