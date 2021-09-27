import React from 'react';

import { styled } from '@mui/material/styles';

import { SourceTopbar, Theatre, Transcript } from './components';

const Root = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  [`& .topbar`]: {
    alignItems: 'stretch',
    borderBottom: `1px solid ${theme.palette.divider}`,
    minHeight: 'auto',
    position: 'absolute',
  },
  [`& .topbarSide`]: {
    alignItems: 'center',
    display: 'flex',
    flexBasis: 'auto',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: theme.spacing(0, 0.5),
    [`&.topbarSide--left`]: {
      borderRight: `1px solid ${theme.palette.divider}`,
    },
    [`&.topbarSide--right`]: {
      borderLeft: `1px solid ${theme.palette.divider}`,
      marginLeft: `-1px`,
    },
  },
}));

export default function Source(props) {
  const { media, transcript } = props.source;
  return (
    <Root className={`RemixerPane RemixerPane--Source`}>
      <SourceTopbar {...props} />
      <Theatre media={media} />
      <Transcript transcript={transcript} />
    </Root>
  );
}