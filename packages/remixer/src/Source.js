import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { styled } from '@mui/material/styles';

import { Stage, Transcript } from './components';

const PREFIX = 'Source';
const classes = {
  root: `${PREFIX}-root`,
  theatre: `${PREFIX}-theatre`,
  transcript: `${PREFIX}-transcript`,
};

const Root = styled('div')(({ theme }) => ({
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  justifyContent: 'space-between',
  position: 'relative',
  [`& .${classes.theatre}`]: {
    aligenItems: 'center',
    backgroundColor: 'black',
    color: theme.palette.primary.contrastText,
    display: 'flex',
    flexBasis: '40%',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: theme.spacing(2, 0),
    width: '100%',
  },
  [`& .${classes.transcript}`]: {
    flexBasis: '60%',
    overflow: 'auto',
    padding: theme.spacing(2, 0),
    width: '100%',
  },
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
  const singlePlayer = useMemo(() => !editable && media.length === 1, [media, editable]);
  const singlePlayerOffset = useMemo(() => blocks?.[0]?.start ?? 0, [blocks]);
  // console.log({ singlePlayerOffset });

  // useEffect(() => {
  //   reference.current.addEventListener('timeupdate', () => setTime(1e3 * (reference.current?.currentTime ?? 0)));
  // }, [reference]);

  // useEffect(() => console.log({ time }), [time]);

  return (
    <Root className={classes.root}>
      <Box className={classes.theatre}>
        <Container maxWidth="sm">
          <Stage {...{ blocks, media, players, reference, time, setTime, singlePlayer, singlePlayerOffset }} />
        </Container>
      </Box>
      <Box className={classes.transcript}>
        <Container maxWidth="sm">
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
        </Container>
      </Box>
    </Root>
  );
};

export default Source;
