import React, { useRef, useState, useEffect } from 'react';
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
      display: 'flex',
      flex: '1 1 100%',
      flexDirection: 'column',
      justifyContent: 'center',
      margin: theme.spacing(0, 2, 12),
      textAlign: 'center',
      [`& *`]: {
        margin: theme.spacing(1),
        color: theme.palette.text.disabled,
      },
    },
    [`& .${classes.theatre}`]: {
      backgroundColor: 'black',
      borderLeft: `1px solid rgba(255,255,255,0.22)`,
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
      borderLeft: `1px solid ${theme.palette.divider}`,
      flexBasis: '60%',
      overflow: 'auto',
      padding: theme.spacing(2, 0),
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

  // useEffect(() => {
  //   if (reference.current)
  //     reference.current.addEventListener('timeupdate', () => setTime(1e3 * (reference.current?.currentTime ?? 0)));
  // }, [reference]);

  const [blocksOverride, setBlockOverride] = useState();

  return (
    <>
      <Root className="RemixerPane RemixerPane--Remix">
        <Toolbar sx={{ bgcolor: 'black', width: '100%' }} />
        <Box className={classes.toolbar}>
          <RemixTopbar {...props} />
        </Box>
        {blocks?.length > 0 ? (
          <>
            <Box className={classes.theatre}>
              <Container maxWidth="sm" sx={{ px: { xs: 0, sm: 3 } }}>
                <Stage {...{ media, players, reference, time, setTime }} blocks={blocksOverride ?? blocks} />
              </Container>
            </Box>
            <Box className={classes.transcript}>
              <Container maxWidth="sm">
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
            <Box className={classes.theatre}>
              <Container maxWidth="sm" sx={{ px: { xs: 0, sm: 3 } }}></Container>
            </Box>
            <Box className={classes.transcript}>
              <Container maxWidth="sm">
                <Droppable droppableId={`droppable:${id}`} type="BLOCK" isDropDisabled={!editable}>
                  {(provided, snapshot) => (
                    <div
                      className={`${classes.intro} transcriptDropArea ${
                        snapshot.isDraggingOver && 'transcriptSnapshotDropArea'
                      }`}
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      <StartDropIcon />
                      <Typography variant="body2">
                        Start by dropping an effect or a section from the source transcript
                      </Typography>
                    </div>
                  )}
                </Droppable>
              </Container>
            </Box>
          </>
        )}
        {editable && <InsertsBar />}
      </Root>
    </>
  );
};

export default Remix;
