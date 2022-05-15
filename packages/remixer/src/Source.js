import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import isEqual from 'react-fast-compare';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import { styled } from '@mui/material/styles';

import Stage from './components/Stage';
import Transcript from './components/Transcript';
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
    flexDirection: 'column',
    justifyContent: 'center',
    transition: `flex-basis ${theme.transitions.duration.standard}ms ${theme.transitions.easing.easeInOut}`,
    transition: `flex-basis ${theme.transitions.duration.standard}ms ${theme.transitions.easing.easeInOut}`,
    width: '100%',
    '& .Mui-disabled': { color: 'rgba(255,255,255,0.5) !important' },
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(0, 0, 2),
    },
  },
  [`& .${classes.transcript}`]: {
    flexBasis: '60%',
    overflow: 'auto',
    flexGrow: 1,
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

  const [hideVideo, setHideVideo] = useState(false);
  const [pip, setPip] = useState(false);
  const [time, setTime] = useState(0);
  const singlePlayer = useMemo(() => !editable && media.length === 1, [media, editable]);
  const singlePlayerOffset = useMemo(() => blocks?.[0]?.start ?? 0, [blocks]);
  // console.log({ singlePlayerOffset });

  // useEffect(() => {
  //   reference.current.addEventListener('timeupdate', () => setTime(1e3 * (reference.current?.currentTime ?? 0)));
  // }, [reference]);

  // useEffect(() => console.log({ time }), [time]);

  const onEnablePIP = useCallback(() => setPip(true), []);
  const onDisablePIP = useCallback(() => setPip(false), []);

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
      <Box className={classes.theatre} sx={{ flexBasis: hideVideo || pip ? '80px' : '40%' }}>
        <Container maxWidth="sm" sx={{ px: { xs: 0, sm: 3 } }}>
          <Stage
            {...{ blocks, media, players, reference, time, setTime, singlePlayer, singlePlayerOffset }}
            hideVideo={hideVideo}
            pip={pip}
            onDisablePIP={onDisablePIP}
            onEnablePIP={onEnablePIP}
            handleHideVideo={() => setHideVideo(prevState => !prevState)}
          />
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

// export default React.memo(Source, isEqual);
export default Source;
