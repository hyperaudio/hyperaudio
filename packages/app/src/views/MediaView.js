import React from 'react';

import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

import { Topbar } from '@hyperaudio/app/src/components';
import { Remixer } from '@hyperaudio/remixer/src/index.js';

const PREFIX = `MediaView`;
const classes = {
  root: `${PREFIX}-Root`,
};

const Root = styled('div', {})(({ theme }) => ({}));

export function MediaView(props) {
  const { organization, account, remix, sources } = props;
  return (
    <Root className={classes.root}>
      <Topbar account={account} organization={organization} title="Remixer" />
      <Box sx={{ top: '63px', position: 'absolute', width: '100%', bottom: 0 }}>
        <Remixer remix={remix} sources={sources} media={[]} />
      </Box>
    </Root>
  );
}
