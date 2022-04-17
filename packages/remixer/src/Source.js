import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import { styled } from '@mui/material/styles';

import { Stage, Transcript } from './components';
import SourceTopbar from './components/SourceTopbar';

const PREFIX = 'Source';
const classes = {
  root: `${PREFIX}-root`,
  toolbar: `${PREFIX}-toolbar`,
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
  [`& .${classes.toolbar}`]: {
    backgroundColor: 'black',
    color: theme.palette.primary.contrastText,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    '& .Mui-disabled': { color: 'rgba(255,255,255,0.5) !important' },
  },
  [`& .${classes.theatre}`]: {
    backgroundColor: 'black',
    color: theme.palette.primary.contrastText,
    display: 'flex',
    flexBasis: '40%',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(0, 0, 2),
    },
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
      {!isSingleMedia && (
        <>
          <Toolbar sx={{ bgcolor: 'black', width: '100%' }} />
          <Box className={classes.toolbar}>
            <SourceTopbar {...props} />
          </Box>
        </>
      )}
      <Box className={classes.theatre}>
        <Container maxWidth="sm" sx={{ px: { xs: 0, sm: 3 } }}>
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
