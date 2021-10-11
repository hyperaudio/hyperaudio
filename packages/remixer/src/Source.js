import React, { useRef } from 'react';

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
  const { source } = props;

  const players = useRef({});

  return (
    <Root className={`RemixerPane RemixerPane--Source`}>
      <SourceTopbar {...props} />
      <Theatre id={source.data.id} media={source.data.url} players={players} />
      <Transcript blocks={source.data.blocks} players={players} />
    </Root>
  );
}
