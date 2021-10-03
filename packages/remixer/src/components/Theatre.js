import React from 'react';
import ReactPlayer from 'react-player';

import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
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

export const Theatre = props => {
  return (
    <Root className={classes.root}>
      <Container maxWidth="md">
        <div className={classes.playerWrapper}>
          <ReactPlayer
            className={classes.player}
            height="100%"
            url="https://www.youtube.com/watch?v=TnkdoEZhTbc"
            width="100%"
          />
        </div>
        <div>
          <IconButton>
            <PlayArrowIcon />
          </IconButton>
        </div>
      </Container>
    </Root>
  );
};
