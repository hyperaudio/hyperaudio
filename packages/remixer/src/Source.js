import React, { useRef, useState, useEffect } from 'react';

import { styled } from '@mui/material/styles';

import { SourceTopbar, Theatre, Transcript } from './components';

const Root = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
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
