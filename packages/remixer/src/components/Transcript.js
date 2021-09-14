import React from 'react';
import { styled } from '@mui/material/styles';

const PREFIX = 'Transcript';
const classes = {
  root: `${PREFIX}`,
};

const Root = styled('div')(({ theme }) => ({}));

export const Transcript = ({ transcript }) => {
  return <Root className={classes.root}>{transcript}</Root>;
};
