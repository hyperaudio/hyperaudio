import React, { useRef, useState, useEffect } from 'react';

import { styled } from '@mui/material/styles';

import { SourceTopbar, MediaTopbar, Theatre, Transcript } from './components';

const Root = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

const Source = props => {
  const {
    editable,
    isSingleMedia,
    source: { id, blocks, media },
  } = props;

  const reference = useRef();
  const players = useRef({});

  const [time, setTime] = useState(0);

  useEffect(() => {
    reference.current.addEventListener('timeupdate', () => setTime(1e3 * (reference.current?.currentTime ?? 0)));
  }, [reference]);

  return (
    <Root className={`RemixerPane RemixerPane--Source`}>
      {isSingleMedia ? <MediaTopbar {...props} /> : <SourceTopbar {...props} />}
      <Theatre {...{ blocks, media, players, reference, time }} />
      <div className="transcriptWrap">
        <Transcript {...{ id, blocks, players, reference, time, editable, isSource: true }} />
      </div>
    </Root>
  );
};

export default Source;
