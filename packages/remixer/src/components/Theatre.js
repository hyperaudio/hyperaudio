import React from 'react';

import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { styled } from '@mui/material/styles';

const PREFIX = 'Theatre';
const classes = {
  root: `${PREFIX}`,
};

const Root = styled('div')(({ theme }) => ({
  textAlign: 'center',
  alignItems: 'center',
  display: 'flex',
  flex: '1 0 300px',
  flexFlow: 'column nowrap',
  justifyContent: 'center',
  padding: theme.spacing(2),
}));

export const Theatre = () => {
  return (
    <Root className={classes.root}>
      <Container maxWidth="md">
        <div>Player 16x9</div>
        <div>
          <IconButton>
            <PlayArrowIcon />
          </IconButton>
        </div>
      </Container>
    </Root>
  );
};
