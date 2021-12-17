import React, { useRef, useState, useEffect } from 'react';

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
      // marginLeft: `-1px`,
    },
  },
}));

const Source = props => {
  const {
    source: { id, blocks, media },
    editable,
  } = props;

  const reference = useRef();
  const players = useRef({});

  const [time, setTime] = useState(0);

  useEffect(() => {
    reference.current.addEventListener('timeupdate', () => setTime(1e3 * (reference.current?.currentTime ?? 0)));
  }, [reference]);

  return (
    <Root className={`RemixerPane RemixerPane--Source`}>
      <SourceTopbar {...props} />
      <Theatre {...{ blocks, media, players, reference, time }} />
      <div className="transcriptWrap">
        <Transcript {...{ id, blocks, players, reference, time, editable, isSource: true }} />
      </div>
    </Root>
  );
};

export default Source;
