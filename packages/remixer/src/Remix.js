import React, { useRef, useState, useEffect } from 'react';
import { Droppable } from 'react-beautiful-dnd';

import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

import { RemixTopbar, Stage, Transcript, InsertsBar } from './components';
import { StartDropIcon } from '@hyperaudio/common';

const PREFIX = 'Remix';
const classes = {
  intro: `${PREFIX}-intro`,
};
const Root = styled('div')(({ theme }) => {
  return {
    backgroundColor: theme.palette.background.default,
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
        <RemixTopbar {...props} />
        {blocks?.length > 0 ? (
          <>
            <Stage {...{ media, players, reference, time, setTime }} blocks={blocksOverride ?? blocks} />
            <div className="transcriptWrap">
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
            </div>
          </>
        ) : (
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
        )}
        {editable && <InsertsBar />}
      </Root>
    </>
  );
};

export default Remix;
