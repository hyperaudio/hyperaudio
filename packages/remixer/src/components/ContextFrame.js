import React from 'react';

import { styled } from '@mui/material/styles';

const PREFIX = 'ContextFrame';
const classes = {
  root: `${PREFIX}-root`,
};

const Root = styled('div')(({ theme }) => ({}));

export const ContextFrame = props => {
  return <Root className={classes.root}>Hello Frame</Root>;
};
