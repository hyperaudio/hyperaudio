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

  useEffect(() => {
    // set the 1st one as active
    setActive(media?.[0]?.id);

    // media.forEach(({ id }) => {
    //   if (!players.current[id]?.setActive) players.current[id] = {};
    //   players.current[id].setActive = () => setActive(id);
    // });
  }, [media]);

  return (
    <Root className={classes.root}>
      <Container maxWidth="md">
        {media?.map(({ id, url }) => (
          <Player key={id} active={active === id} media={{ id, url }} players={players} setActive={setActive} />
        ))}
      </Container>
    </Root>
  );
};

const Player = ({ media: { id, url }, players, active, setActive }) => {
  const ref = useRef();
  const [primed, setPrimed] = useState(false);
  const [playing, setPlaying] = useState(false);

  const onReady = useCallback(() => {
    players.current[id] = ref.current;
    if (!primed) setPlaying(true);
  }, [id, primed]);

  const onPlay = useCallback(() => {
    setPlaying(true);
    setActive(id);
    if (!primed) setPlaying(false);
  }, [id]);

  const onPause = useCallback(() => setPlaying(false), []);

  const onSeek = useCallback(() => {
    console.log('seek', id); // YT not getting here?
    setActive(id);
  }, [id]);

  const onProgress = useCallback(
    progress => {
      console.log(progress);
      setActive(id);
    },
    [id],
  );

  return (
    <>
      <div className={classes.playerWrapper} style={{ display: active ? 'block' : 'none' }}>
        <ReactPlayer
          key={id}
          className={classes.player}
          width="100%"
          height="100%"
          {...{ ref, url, playing, onReady, onPlay, onPause, onSeek, onProgress }}
        />
      </div>
      <div style={{ display: active ? 'block' : 'none' }}>
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
    </>
  );
};
