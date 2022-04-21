import React, { useRef, useCallback, useState, useEffect } from 'react';
import { Droppable } from 'react-beautiful-dnd';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import { styled } from '@mui/material/styles';

import { RemixTopbar, Stage, Transcript, InsertsBar } from './components';
import { StartDropIcon } from '@hyperaudio/common';

const PREFIX = 'Remix';
const classes = {
  intro: `${PREFIX}-intro`,
  toolbar: `${PREFIX}-toolbar`,
  theatre: `${PREFIX}-theatre`,
  transcript: `${PREFIX}-transcript`,
};
const Root = styled('div')(({ theme }) => {
  return {
    backgroundColor: theme.palette.background.default,
    [`& .${classes.toolbar}`]: {
      backgroundColor: 'black',
      color: theme.palette.primary.contrastText,
      left: 0,
      position: 'absolute',
      right: 0,
      top: 0,
      '& .Mui-disabled': { color: 'rgba(255,255,255,0.5) !important' },
    },
    [`& .topbarSide`]: {
      flexBasis: theme.spacing(10),
      [theme.breakpoints.up('sm')]: {
        flexBasis: theme.spacing(10),
      },
      [`&.topbarSide--right > *`]: {
        marginLeft: theme.spacing(1),
      },
      [`&.topbarSide--left > *`]: {
        marginRight: theme.spacing(1),
      },
    },
    [`& .${classes.intro}`]: {
      alignItems: 'center',
      bottom: 0,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      left: 0,
      color: theme.palette.text.secondary,
      position: 'absolute',
      right: 0,
      textAlign: 'center',
      top: 0,
      [`& *`]: {
        margin: theme.spacing(1),
      },
    },
    [`& .${classes.theatre}`]: {
      backgroundColor: 'black',
      borderLeft: `1px solid rgba(255,255,255,0.22)`,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      transition: `flex-basis ${theme.transitions.duration.standard}ms ${theme.transitions.easing.easeInOut}`,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(0, 0, 2),
      },
    },
    [`& .${classes.transcript}`]: {
      borderLeft: `1px solid ${theme.palette.divider}`,
      flexBasis: '60%',
      flexGrow: 1,
      overflow: 'auto',
      padding: theme.spacing(2, 0),
      position: 'relative',
      width: '100%',
    },
  };
});

const Remix = props => {
  const {
    editable,
    remix: { id, blocks, media },
    sources,
    dispatch,
    onSourceChange,
    autoScroll,
  } = props;

  const reference = useRef();
  const players = useRef({});

  const [time, setTime] = useState(0);
  const [hideVideo, setHideVideo] = useState(false);
  const [pip, setPip] = useState(false);

  // useEffect(() => {
  //   if (reference.current)
  //     reference.current.addEventListener('timeupdate', () => setTime(1e3 * (reference.current?.currentTime ?? 0)));
  // }, [reference]);

  const onEnablePIP = useCallback(() => setPip(true), []);
  const onDisablePIP = useCallback(() => setPip(false), []);

  const [blocksOverride, setBlockOverride] = useState();

  return (
    <>
      <Root className="RemixerPane RemixerPane--Remix">
        {blocks.length > 0 ? (
          <>
            <Toolbar sx={{ bgcolor: 'black', width: '100%' }} />
            <Box className={classes.toolbar}>
              <RemixTopbar {...props} />
            </Box>
          </>
        ) : null}
        {blocks?.length > 0 ? (
          <>
            <Box className={classes.theatre} sx={{ flexBasis: hideVideo || pip ? '80px' : '40%' }}>
              <Container maxWidth="sm" sx={{ px: { xs: 0, sm: 3 } }}>
                <Stage
                  {...{ media, players, reference, time, setTime }}
                  blocks={blocksOverride ?? blocks}
                  hideVideo={hideVideo}
                  pip={pip}
                  handleHideVideo={() => setHideVideo(prevState => !prevState)}
                  onDisablePIP={onDisablePIP}
                  onEnablePIP={onEnablePIP}
                />
              </Container>
            </Box>
            <Box className={classes.transcript}>
              <Container maxWidth={false}>
                <Transcript
                  {...{
                    id,
                    blocks,
                    sources,
                    players,
                    reference,
                    time,
                    dispatch,
                    setBlockOverride,
                    onSourceChange,
                    autoScroll,
                  }}
                  editable={editable && !blocksOverride}
                />
              </Container>
            </Box>
          </>
        ) : (
          <>
            <Box
              className={classes.transcript}
              sx={{ flexBasis: blocks?.length > 0 ? '60% !important' : '100% !important' }}
            >
              <Droppable droppableId={`droppable:${id}`} type="BLOCK" isDropDisabled={!editable}>
                {(provided, snapshot) => (
                  <div
                    className={`${classes.intro} transcriptDropArea ${
                      snapshot.isDraggingOver && 'transcriptSnapshotDropArea'
                    }`}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <Container maxWidth="sm">
                      <StartDropIcon color="inherit" />
                      <Typography color="inherit" variant="body2">
                        Start by dropping a section from the source transcript
                      </Typography>
                    </Container>
                  </div>
                )}
              </Droppable>
            </Box>
          </>
        )}
        {editable && blocks.length > 0 && <InsertsBar />}
      </Root>
    </>
  );
};

export default Remix;
