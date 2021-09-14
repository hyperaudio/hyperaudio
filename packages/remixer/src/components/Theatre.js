import React from 'react';

import { styled } from '@mui/material/styles';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import IconButton from '@mui/material/IconButton';

const PREFIX = 'Theatre';
const classes = {
  root: `${PREFIX}`,
};

const Root = styled('div')(({ theme }) => ({
  textAlign: 'center',
}));

export const Theatre = () => {
  return (
    <Root className={classes.root}>
      <div>Player 16x9</div>
      <div>
        <IconButton>
          <PlayArrowIcon />
        </IconButton>
      </div>
    </Root>
  );
};
