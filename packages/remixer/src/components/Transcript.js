import React from 'react';
import { styled } from '@mui/material/styles';

const PREFIX = 'Transcript';
const classes = {
  root: `${PREFIX}`,
};

const Root = styled('div')(({ theme }) => ({
  alignItems: 'center',
  borderTop: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  flex: '2 2 66%',
  flexFlow: 'column nowrap',
  justifyContent: 'flex-start',
  overflow: 'auto',
  padding: theme.spacing(2),
  ['& > div']: {
    maxWidth: '600px',
  },
}));

export const Transcript = ({ transcript }) => {
  return (
    <Root className={classes.root}>
      <div>{transcript}</div>
    </Root>
  );
};
