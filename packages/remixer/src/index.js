import React from 'react';
import { Button, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const PREFIX = 'Remixer';

const classes = {
  root: `${PREFIX}-root`,
  sourcePane: `${PREFIX}-sourcePane`,
  remixPane: `${PREFIX}-remixPane`,
};
const Root = styled('div')(({ theme }) => ({}));
const SourcePane = styled('div')(({ theme }) => ({
  background: 'blue',
}));
const RemixPane = styled('div')(({ theme }) => ({
  background: 'red',
}));

export const Remixer = ({ source, remix }) => {
  return (
    <Root className={classes.root}>
      <SourcePane>Source: {source}</SourcePane>
      <RemixPane>Remix: {remix}</RemixPane>
    </Root>
  );
};
