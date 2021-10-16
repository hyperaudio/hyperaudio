import React from 'react';
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

export const Theatre = props => {
  const { media } = props;
  const [playing, setPlaying] = React.useState(false);

  return (
    <Root className={classes.root}>
      <Container maxWidth="md">
        <div className={classes.playerWrapper}>
          <ReactPlayer
            className={classes.player}
            height="100%"
            onPause={() => setPlaying(false)}
            onPlay={() => setPlaying(true)}
            playing={playing}
            url={media}
            width="100%"
          />
        </div>
        <div>
          {playing ? (
            <Tooltip title="Pause">
              <IconButton onClick={() => setPlaying(false)}>
                <PauseIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Play">
              <IconButton onClick={() => setPlaying(true)}>
                <PlayArrowIcon />
              </IconButton>
            </Tooltip>
          )}
        </div>
      </Container>
    </Root>
  );
};
