import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';

import { styled } from '@mui/material/styles';

import { SourceTopbar, Theatre, Transcript } from './components';

const Root = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

const Source = props => {
  const {
    editable,
    isSingleMedia,
    source: { id, blocks, media },
    autoScroll,
    onSelectTranslation,
  } = props;

  const animationFrame = useRef(0);
  const reference = useRef();
  const players = useRef({});

  const [time, setTime] = useState(0);
  const singlePlayer = useMemo(() => media.length === 1, [media]);
  const singlePlayerOffset = useMemo(() => blocks?.[0]?.start ?? 0, [blocks]);
  // console.log({ singlePlayerOffset });

  // useEffect(() => {
  //   reference.current.addEventListener('timeupdate', () => setTime(1e3 * (reference.current?.currentTime ?? 0)));
  // }, [reference]);

  // useEffect(() => console.log({ time }), [time]);

  return (
    <Root className={`RemixerPane RemixerPane--Source`}>
      {/* {!isSingleMedia && <SourceTopbar {...props} />} */}
      <Theatre {...{ blocks, media, players, reference, time, setTime, singlePlayer, singlePlayerOffset }} />
      <div className="transcriptWrap">
        <Transcript
          {...{
            id,
            blocks,
            players,
            reference,
            time,
            editable,
            isSource: true,
            autoScroll,
            singlePlayer,
            singlePlayerOffset,
          }}
        />
      </div>
    </Root>
  );
};

export default Source;
