import React, { useRef, useCallback, useState, useEffect, useMemo } from 'react';
import ReactPlayer from 'react-player';
import { createSilentAudio } from 'create-silent-audio';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';

import IconButton from '@mui/material/IconButton';
import PauseIcon from '@mui/icons-material/Pause';
import FastForwardIcon from '@mui/icons-material/FastForward';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Slider from '@mui/material/Slider';
import { styled } from '@mui/material/styles';

const PREFIX = 'Theatre';
const classes = {
  playerWrapper: `${PREFIX}-playerWrapper`,
  player: `${PREFIX}-player`,
};

const Root = styled('div')(({ theme }) => ({
  alignItems: 'center',
  display: 'flex',
  flex: '1 0 260px',
  flexFlow: 'column nowrap',
  height: 'auto',
  // minHeight: '400px', // TODO: see if it is still needed?
  justifyContent: 'space-between',
  padding: theme.spacing(2),
  textAlign: 'center',
  [`& .${classes.playerWrapper}`]: {
    position: 'relative',
    paddingTop: '56.25%' /* Player ratio: 100 / (1280 / 720) */,
    marginBottom: theme.spacing(2),
    maxHeight: '260px',
  },
  [`& .${classes.player}`]: {
    position: 'absolute',
    top: 0,
    left: 0,
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

  useEffect(() => setActive(media?.[0]?.id), [media]);

  const intervals = useMemo(
    () =>
      blocks
        .reduce((acc, { start, duration, gap, media }, i, arr) => {
          const prevInterval = acc.pop();
          const offset = prevInterval?.[1] ?? 0;
          return [
            ...acc,
            prevInterval,
            [
              offset, // TODO name these better
              offset + duration + (i < arr.length - 2 && media === arr[i + 1].media ? gap : 0),
              { start, media },
            ],
          ];
        }, [])
        .filter(i => !!i),
    [blocks],
  );

  useEffect(() => {
    const currentInterval = intervals.find(([start, end]) => start <= time && time < end);

    console.log(currentInterval, interval, currentInterval !== interval);

    if (currentInterval) {
      setActive(currentInterval[2].media);
      setInterval(currentInterval);
    } else setReferencePlaying(false);
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
      <Container maxWidth="sm">
        {media?.map(({ id, url }) => (
          <div key={id} className={classes.playerWrapper} style={{ display: active === id ? 'block' : 'none' }}>
            <Player
              key={id}
              active={active === id}
              time={(time - (interval?.[0] ?? 0) + (interval?.[2]?.start ?? 0)) / 1e3}
              playing={referencePlaying && active === id}
              media={{ id, url }}
              {...{ players, setActive, buffering, setBuffering }}
            />
          </div>
        ))}

        <div>
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

const Player = ({ media: { id, url }, players, active, setActive, playing, setPlaying, time, setBuffering }) => {
  const ref = useRef();
  const [primed, setPrimed] = useState(!MATCH_URL_YOUTUBE.test(url));

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
      key={id}
      className={classes.player}
      width="100%"
      height="100%"
      muted={!primed}
      {...{ ref, url, playing, onReady, onPlay, onPause, onSeek, onProgress, onBuffer, onBufferEnd }}
    />
  );
};
