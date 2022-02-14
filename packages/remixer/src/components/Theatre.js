import React, { useRef, useCallback, useState, useEffect, useMemo } from 'react';
import ReactPlayer from 'react-player';
import { createSilentAudio } from 'create-silent-audio';

import Container from '@mui/material/Container';
import FastForwardIcon from '@mui/icons-material/FastForward';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Slider from '@mui/material/Slider';
import { styled } from '@mui/material/styles';

const PREFIX = 'Theatre';
const classes = {
  controls: `${PREFIX}-controls`,
  core: `${PREFIX}-core`,
  effect: `${PREFIX}-effect`,
  player: `${PREFIX}-player`,
  stage: `${PREFIX}-stage`,
};

const Root = styled('div')(({ theme }) => ({
  paddingBottom: theme.spacing(1),
  [theme.breakpoints.up('xl')]: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(4),
  },
  [`& .${classes.core}`]: {},
  [`& .${classes.stage}`]: {
    position: 'relative',
  },
  [`& .${classes.player}`]: {
    maxHeight: '260px',
    paddingTop: '56.25%' /* Player ratio: 100 / (1280 / 720) */,
    position: 'relative',
  },
  // [`& .${classes.effect}`]: {
  // },
  [`& .${classes.controls}`]: {
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
}));

// https://github.com/cookpete/react-player/blob/master/src/patterns.js
const MATCH_URL_YOUTUBE =
  /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed\/|v\/|watch\/|watch\?v=|watch\?.+&v=))((\w|-){11})|youtube\.com\/playlist\?list=|youtube\.com\/user\//;
// const MATCH_URL_VIMEO = /vimeo\.com\/.+/;

export const Theatre = ({ blocks, media, players, reference, time }) => {
  const duration = useMemo(
    () =>
      blocks.reduce(
        (acc, { media, duration, gap }, i, arr) =>
          acc + duration + (i < arr.length - 2 && media === arr[i + 1].media ? gap : 0),
        0,
      ),
    [blocks],
  );

  useEffect(() => {
    // @ts-ignore
    reference.current.src = createSilentAudio(Math.ceil(duration / 1e3), 44100);
  }, [reference, duration]);

  const [active, setActive] = useState();
  const [interval, setInterval] = useState();
  const [referencePlaying, setReferencePlaying] = useState();
  const [buffering, setBuffering] = useState(false);
  const [insert, setInsert] = useState();

  useEffect(() => setActive(media?.[0]?.id), [media]);

  const intervals = useMemo(
    () =>
      blocks
        .reduce((acc, block, i, arr) => {
          const { start, duration, gap, media } = block;
          const prevInterval = acc.pop();
          const offset = prevInterval?.[1] ?? 0;
          return [
            ...acc,
            prevInterval,
            [
              offset, // TODO name these better
              offset + duration + (i < arr.length - 2 && media === arr[i + 1].media ? gap : 0),
              { start, media, block },
            ],
          ];
        }, [])
        .filter(i => !!i),
    [blocks],
  );

  useEffect(() => {
    const currentIntervalIndex = intervals.findIndex(([start, end]) => start <= time && time < end);
    const currentInterval = intervals[currentIntervalIndex];

    if (currentInterval !== interval && currentIntervalIndex > 0) {
      const prevInterval = intervals[currentIntervalIndex - 1];
      console.log('previous', prevInterval);

      if (prevInterval[2].block.type === 'title') {
        console.log('TITLE', prevInterval[2].block.text);
        setInsert(prevInterval[2].block);
      } else if (prevInterval[2].block.type === 'transition') {
        console.log('TRANSITION', prevInterval[2].block);
        setInsert(prevInterval[2].block);
      } else {
        setInsert(null);
      }
    }

    if (currentInterval) {
      setActive(currentInterval[2].media);
      setInterval(currentInterval);
    } else {
      setReferencePlaying(false);
      const lastInterval = intervals[intervals.length - 1];
      if (lastInterval[2].block.type === 'transition') {
        setInsert(lastInterval[2].block);
      }
    }
  }, [intervals, interval, time]);

  const onPlay = useCallback(() => {
    if (buffering) return;
    setReferencePlaying(true);
  }, [active, buffering]);

  const onPause = useCallback(() => {
    if (buffering) return;
    setReferencePlaying(false);
  }, [buffering]);

  const play = useCallback(() => reference.current?.play(), [reference]);
  const pause = useCallback(() => reference.current?.pause(), [reference]);

  const handleSliderChange = (event, value) => {
    reference.current.currentTime = value;
  };

  console.log({ referencePlaying });
  console.log({ active });

  useEffect(() => {
    if (buffering && referencePlaying) {
      reference.current.pause();
    } else if (!buffering && referencePlaying) {
      reference.current.play();
    }
  }, [buffering, reference]);

  return (
    <Root>
      <Container className={classes.core} maxWidth="sm">
        <div className={classes.stage}>
          {media?.map(({ id, url, poster }) => (
            <div key={id} className={classes.player} style={{ display: active === id ? 'block' : 'none' }}>
              <Player
                key={id}
                active={active === id}
                time={(time - (interval?.[0] ?? 0) + (interval?.[2]?.start ?? 0)) / 1e3}
                playing={referencePlaying && active === id}
                media={{ id, url, poster }}
                {...{ players, setActive, buffering, setBuffering }}
              />
            </div>
          ))}

          {insert && insert.type === 'title' && (
            <>
              <div className={insert.fullSize ? 'insertTitle fullSize' : 'insertTitle lowerThirds'}>{insert.text}</div>
              <style scoped>
                {`
                .insertTitle {
                  pointer-events: none;
                  position: absolute;
                  bottom: 0;
                  left: 0;
                  background: rgba(0, 0, 0, 0.5);
                  color: white;
                  animation: hideAnimation 0s ease-in 3s;
                  animation-fill-mode: forwards;
                }

                .insertTitle.fullSize {
                  width: 100%;
                  height: 100%;
                }

                .insertTitle.lowerThirds {
                  width: 100%;
                  height: 33%;
                }

                @keyframes hideAnimation {
                  100% {
                    visibility: hidden;
                  }
                }
              `}
              </style>
            </>
          )}

          {insert && insert.type === 'transition' && (
            <>
              <div className="insertTransition"></div>
              <style scoped>
                {`
                .insertTransition {
                  pointer-events: none;
                  position: absolute;
                  top: 0;
                  left: 0;
                  background-color: #000;
                  opacity: 1;
                  animation: transitionAnimation ${(insert.transition ?? 3000) / 1e3}s;
                  animation-fill-mode: forwards;
                  width: 100%;
                  height: 100%;
                }

                @keyframes transitionAnimation {
                  0% {
                    opacity: 0;
                  }
                  99% {
                    width: 100%;
                    height: 100%;
                  }
                  100% {
                    opacity: 1;
                    visibility: hidden;
                    width: 0;
                    height: 0;
                  }
                }
              `}
              </style>
            </>
          )}
        </div>
        <div className={classes.controls}>
          <Grid container spacing={2} sx={{ alignItems: 'center' }}>
            <Grid item>
              {referencePlaying ? (
                buffering ? (
                  <IconButton onClick={pause} size="small">
                    <FastForwardIcon />
                  </IconButton>
                ) : (
                  <IconButton onClick={pause} size="small">
                    <PauseIcon />
                  </IconButton>
                )
              ) : (
                <IconButton onClick={play} size="small">
                  <PlayArrowIcon />
                </IconButton>
              )}
            </Grid>
            <Grid container item xs>
              <Slider
                aria-label="timeline"
                defaultValue={0}
                max={duration / 1e3}
                min={0}
                onChange={handleSliderChange}
                size="small"
                value={time / 1e3}
                valueLabelDisplay="auto"
              />
            </Grid>
          </Grid>
          <audio
            controls
            muted
            // @ts-ignore
            ref={reference}
            onPlay={onPlay}
            onPause={onPause}
            style={{ display: 'none' }}
          />
        </div>
      </Container>
    </Root>
  );
};

const Player = ({
  media: { id, url, poster },
  players,
  active,
  setActive,
  playing,
  setPlaying,
  time,
  setBuffering,
}) => {
  const ref = useRef();
  const [primed, setPrimed] = useState(!MATCH_URL_YOUTUBE.test(url));
  const config = useMemo(
    () => ({
      file: {
        attributes: {
          poster,
        },
      },
    }),
    [poster],
  );

  useEffect(() => {
    if (Math.abs(ref.current.getCurrentTime() - time) > 0.3) {
      ref.current?.seekTo(time, 'seconds');
    }
  }, [ref, time]);

  const onReady = useCallback(() => {
    players.current[id] = ref.current;
    if (!primed) {
      // setPlaying(id); // TODO make this via ref?
      // setActive(id);
    }
  }, [id, primed]);

  const onPlay = useCallback(() => {
    // setPlaying(id);
    // setActive(id);
    if (!primed) {
      setPrimed(true);
      // setPlaying(false); // TODO make this via ref?
    }
  }, [id, primed]);

  const onPause = useCallback(() => {
    // setPlaying(false);
  }, []);

  const onSeek = useCallback(() => {
    // console.log('seek', id);
    // setActive(id);
  }, [id]);

  const onProgress = useCallback(
    progress => {
      // console.log(progress);
      // setActive(id);
    },
    [id],
  );

  const onBuffer = useCallback(() => {
    console.log('onBuffer', id);
    setBuffering(true);
  }, [id, setBuffering]);

  const onBufferEnd = useCallback(() => {
    console.log('onBufferEnd', id);
    setBuffering(false);
  }, [id, setBuffering]);

  return (
    <ReactPlayer
      height="100%"
      key={id}
      width="100%"
      style={{
        left: 0,
        position: 'absolute',
        top: 0,
      }}
      muted={!primed}
      {...{ ref, config, url, playing, onReady, onPlay, onPause, onSeek, onProgress, onBuffer, onBufferEnd }}
    />
  );
};
