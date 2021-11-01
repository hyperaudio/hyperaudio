import React, { useRef, useCallback, useState, useEffect, useMemo } from 'react';
import ReactPlayer from 'react-player';
import { createSilentAudio } from 'create-silent-audio';

import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Slider from '@mui/material/Slider';
import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';

const PREFIX = 'Theatre';
const classes = {
  root: `${PREFIX}`,
  playerWrapper: `${PREFIX}-playerWrapper`,
  player: `${PREFIX}-player`,
};

const Root = styled('div')(({ theme }) => ({
  textAlign: 'center',
  alignItems: 'center',
  display: 'flex',
  flex: '1 0 260px',
  flexFlow: 'column nowrap',
  justifyContent: 'center',
  padding: theme.spacing(2),
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
  // const [playing, setPlaying] = useState();

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
              offset,
              offset + duration + (i < arr.length - 2 && media === arr[i + 1].media ? gap : 0),
              { start, media },
            ],
          ];
        }, [])
        .filter(i => !!i),
    [blocks],
  );

  useEffect(() => {
    const interval = intervals.find(([start, end]) => start <= time && time < end);
    if (interval) {
      setActive(interval[2].media);
      setInterval(interval);
    } else setReferencePlaying(false);
  }, [intervals, time]);

  const onPlay = useCallback(() => {
    setReferencePlaying(true);
    // setPlaying(active);
  }, [active]);

  const onPause = useCallback(() => {
    setReferencePlaying(false);
    // setPlaying(null);
  }, []);

  const play = useCallback(() => reference.current?.play(), [reference]);
  const pause = useCallback(() => reference.current?.pause(), [reference]);

  const handleSliderChange = (event, value) => {
    reference.current.currentTime = value;
  };

  return (
    <Root className={classes.root}>
      <Container maxWidth="md">
        {media?.map(({ id, url }) => (
          <div key={id} className={classes.playerWrapper} style={{ display: active === id ? 'block' : 'none' }}>
            <Player
              key={id}
              active={active === id}
              time={(time - (interval?.[0] ?? 0) + (interval?.[2]?.start ?? 0)) / 1e3}
              // playing={referencePlaying && playing === id && active === id}
              playing={referencePlaying && active === id}
              media={{ id, url }}
              // {...{ players, setActive, setPlaying }}
              {...{ players, setActive }}
            />
          </div>
        ))}

        <div>
          {referencePlaying ? (
            <IconButton onClick={pause}>
              <PauseIcon />
            </IconButton>
          ) : (
            <IconButton onClick={play}>
              <PlayArrowIcon />
            </IconButton>
          )}
          <Slider
            size="small"
            defaultValue={0}
            value={time / 1e3}
            min={0}
            max={duration / 1e3}
            aria-label="timeline"
            valueLabelDisplay="auto"
            onChange={handleSliderChange}
          />
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

const Player = ({ media: { id, url }, players, active, setActive, playing, setPlaying, time }) => {
  const ref = useRef();
  const [primed, setPrimed] = useState(!MATCH_URL_YOUTUBE.test(url));

  // console.log(time, active, playing, id);

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

  return (
    <ReactPlayer
      key={id}
      className={classes.player}
      width="100%"
      height="100%"
      muted={!primed}
      {...{ ref, url, playing, onReady, onPlay, onPause, onSeek, onProgress }}
    />
  );
};
