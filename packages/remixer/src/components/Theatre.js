import React, { useRef, useCallback, useState, useEffect, useMemo } from 'react';
import ReactPlayer from 'react-player';
import { createSilentAudio } from 'create-silent-audio';
import TC from 'smpte-timecode';
import mux from 'mux-embed';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import FastForwardIcon from '@mui/icons-material/FastForward';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import IconButton from '@mui/material/IconButton';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

const PREFIX = 'Theatre';
const classes = {
  controls: `${PREFIX}-controls`,
  effect: `${PREFIX}-effect`,
  player: `${PREFIX}-player`,
  posterTitle: `${PREFIX}-posterTitle`,
  root: `${PREFIX}-root`,
  stage: `${PREFIX}-stage`,
};

const Root = styled(Box)(({ theme }) => ({
  background: theme.palette.text.primary,
  color: theme.palette.primary.contrastText,
  [`& .${classes.stage}`]: {
    position: 'relative',
  },
  [`& .${classes.controls}`]: {},
  [`& .${classes.posterTitle}`]: {
    background: `linear-gradient(to bottom, rgba(0,0,0,0.44) 0%, rgba(0,0,0,0.88) 100%)`,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    left: 0,
    padding: theme.spacing(2),
    position: 'absolute',
    right: 0,
    top: 0,
    transition: `opacity ${theme.transitions.duration.standard}ms`,
    // h2: {
    //   maxWidth: '66%',
    // },
    span: {
      borderBottom: `2px solid ${theme.palette.primary.main}`,
    },
  },
}));

// https://github.com/cookpete/react-player/blob/master/src/patterns.js
const MATCH_URL_YOUTUBE =
  /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed\/|v\/|watch\/|watch\?v=|watch\?.+&v=))((\w|-){11})|youtube\.com\/playlist\?list=|youtube\.com\/user\//;
// const MATCH_URL_VIMEO = /vimeo\.com\/.+/;

// https://gist.github.com/ktcy/1e981cfee7a309beebb33cdab1e29715
/**
 * It creates a WAV file with the given number of seconds of silence
 * @param [seconds=1] - The length of the silence in seconds.
 * @returns A URL to a blob of audio data.
 */
function createSilence(seconds = 1) {
  const sampleRate = 8000;
  const numChannels = 1;
  const bitsPerSample = 8;

  const blockAlign = (numChannels * bitsPerSample) / 8;
  const byteRate = sampleRate * blockAlign;
  const dataSize = Math.ceil(seconds * sampleRate) * blockAlign;
  const chunkSize = 36 + dataSize;
  const byteLength = 8 + chunkSize;

  const buffer = new ArrayBuffer(byteLength);
  const view = new DataView(buffer);

  view.setUint32(0, 0x52494646, false); // Chunk ID 'RIFF'
  view.setUint32(4, chunkSize, true); // File size
  view.setUint32(8, 0x57415645, false); // Format 'WAVE'
  view.setUint32(12, 0x666d7420, false); // Sub-chunk 1 ID 'fmt '
  view.setUint32(16, 16, true); // Sub-chunk 1 size
  view.setUint16(20, 1, true); // Audio format
  view.setUint16(22, numChannels, true); // Number of channels
  view.setUint32(24, sampleRate, true); // Sample rate
  view.setUint32(28, byteRate, true); // Byte rate
  view.setUint16(32, blockAlign, true); // Block align
  view.setUint16(34, bitsPerSample, true); // Bits per sample
  view.setUint32(36, 0x64617461, false); // Sub-chunk 2 ID 'data'
  view.setUint32(40, dataSize, true); // Sub-chunk 2 size

  for (let offset = 44; offset < byteLength; offset++) {
    view.setUint8(offset, 128);
  }

  const blob = new Blob([view], { type: 'audio/wav' });
  const url = URL.createObjectURL(blob);

  return url;
}

export const Theatre = ({ blocks, media, players, reference, time = 0, setTime, singlePlayer, singlePlayerOffset }) => {
  const [seekTime, setSeekTime] = useState(36 * 1e6); // FIXME why magic number?
  const duration = useMemo(
    () =>
      (singlePlayer ? singlePlayerOffset : 0) +
      blocks.reduce((acc, { media, duration, gap }, i, arr) => {
        // console.log({ i, duration, gap });
        return acc + duration + (i < arr.length - 2 && media === arr[i + 1].media ? gap : 0);
      }, 0),
    [blocks, singlePlayer, singlePlayerOffset],
  );

  // useEffect(() => {
  //   reference.current.addEventListener('timeupdate', () => setTime(1e3 * (reference.current?.currentTime ?? 0)));
  // }, [reference, duration]);

  useEffect(() => {
    if (!singlePlayer) {
      // reference.current.src = createSilentAudio(duration > 0 ? Math.ceil(duration / 1e3) : 60, 8000); // 44100
      reference.current.src = createSilence(duration > 0 ? Math.ceil(duration / 1e3) : 60);
      reference.current.addEventListener('timeupdate', () => {
        setTime && setTime(1e3 * (reference.current?.currentTime ?? 0));
      });
    } else {
      // reference.current?.getInternalPlayer()?.addEventListener('timeupdate', () => {
      //   setTime && setTime(1e3 * (reference.current?getInternalPlayer()?.currentTime ?? 0));
      // });
    }
  }, [reference, duration, setTime, singlePlayer]);

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
              // TODO name these better
              offset, // offset (aka start) in timeline
              offset + duration + (i < arr.length - 2 && media === arr[i + 1].media ? gap : 0), // end in timeline
              { start, media, block, offset, duration, useGap: i < arr.length - 2 && media === arr[i + 1].media, gap }, // start in block, media and block for debug
            ],
          ];
        }, [])
        .filter(i => !!i),
    // .reduce((acc, interval, i, arr) => {
    //   if (i === 0) return [interval];

    //   const prevInterval = acc.pop();
    //   const [prevStart, prevEnd, prevData] = prevInterval;
    //   const [start, end, data] = interval;

    //   if (prevEnd === start) return [...acc, [prevStart, end, { ...prevData, ...data }]];

    //   return [...acc, prevInterval, interval];
    // }, []),
    [blocks],
  );

  useEffect(() => {
    if (singlePlayer && time / 1e3 < singlePlayerOffset) return;

    const currentIntervalIndex = intervals.findIndex(([start, end]) => start <= time && time < end);
    const currentInterval = intervals[currentIntervalIndex];

    if (currentInterval !== interval && currentIntervalIndex > 0) {
      const prevInterval = intervals[currentIntervalIndex - 1];
      // console.log('previous', prevInterval);

      // FIXME this is based on intervals having one block
      // if (prevInterval[2].block.type === 'title') {
      //   console.log('TITLE', prevInterval[2].block.text);
      //   setInsert(prevInterval[2].block);
      // } else if (prevInterval[2].block.type === 'transition') {
      //   console.log('TRANSITION', prevInterval[2].block);
      //   setInsert(prevInterval[2].block);
      // } else {
      //   setInsert(null);
      // }
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
  }, [intervals, interval, time, singlePlayer, singlePlayerOffset]);

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

  const [firstPlay, setFirstPlay] = useState(true);
  const handlePlay = useCallback(async () => {
    setFirstPlay(false);

    !singlePlayer && reference.current?.play();
    singlePlayer && reference.current?.getInternalPlayer().play();

    // if (players.current[active].getInternalPlayer()) {
    //   players.current[active].getInternalPlayer().muted = false;
    //   players.current[active].getInternalPlayer().volume = 1;
    // }
  }, [players, active, reference, firstPlay]);

  const handlePause = useCallback(() => {
    !singlePlayer && reference.current?.pause();
    singlePlayer && reference.current?.getInternalPlayer().pause();
  }, []);

  const handleSliderChange = (event, value) => {
    // setSeekTime(value * 1e3);
    console.log(value);
    if (!singlePlayer) reference.current.currentTime = value;
    if (singlePlayer) reference.current.seekTo(value, 'seconds');
  };

  // useEffect(() => console.log({ referencePlaying }), [referencePlaying]);
  // useEffect(() => console.log({ active }), [active]);
  // useEffect(() => console.log({ intervals }), [intervals]);

  useEffect(() => {
    console.log('buf', { reference });
    if (buffering && referencePlaying) {
      !singlePlayer && reference.current?.pause();
      singlePlayer && reference.current?.getInternalPlayer().pause();
    } else if (!buffering && referencePlaying) {
      !singlePlayer && reference.current?.play();
      singlePlayer && reference.current?.getInternalPlayer().play();
    }
  }, [buffering, reference, singlePlayer]);

  return (
    <Root
      className={classes.root}
      sx={{
        bgcolor: 'black',
        color: 'white',
        width: '100%',
        '& .Mui-disabled': { color: 'rgba(255,255,255,0.5) !important' },
      }}
    >
      <Box sx={{ py: 2 }}>
        <Container maxWidth="sm">
          <Box sx={{ mb: 2 }}>
            {!singlePlayer
              ? media?.map(({ id, url, poster, title }) => (
                  <div key={id} style={{ display: active === id ? 'block' : 'none' }}>
                    <Player
                      key={id}
                      active={active === id}
                      time={time - (interval?.[0] ?? 0) + (interval?.[2]?.start ?? 0)}
                      // time={(time - (interval?.[0] ?? 0)) / 1e3}
                      playing={referencePlaying && active === id}
                      media={{ id, url, poster, title }}
                      {...{ players, setActive, buffering, setBuffering }}
                    />
                  </div>
                ))
              : null}

            {singlePlayer ? (
              <div style={{ display: 'block' }}>
                <SinglePlayer
                  media={media[0]}
                  {...{ buffering, setBuffering, onPlay, onPause, setTime }}
                  playing={referencePlaying}
                  ref={reference}
                  singlePlayerOffset={singlePlayerOffset}
                />
              </div>
            ) : null}

            {insert && insert.type === 'title' && (
              <>
                <div className={insert.fullSize ? 'insertTitle fullSize' : 'insertTitle lowerThirds'}>
                  {insert.text}
                </div>
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
          </Box>
          <Stack spacing={2} direction="row" sx={{ alignItems: 'center', pr: { lg: 2 } }}>
            {buffering && seekTime !== time ? (
              <IconButton onClick={handlePause} color="inherit">
                {seekTime - time > 0 ? <FastForwardIcon /> : <FastRewindIcon />}
              </IconButton>
            ) : referencePlaying ? (
              <IconButton onClick={handlePause} color="inherit">
                <PauseIcon />
              </IconButton>
            ) : (
              <IconButton onClick={handlePlay} color="inherit">
                <PlayArrowIcon />
              </IconButton>
            )}
            <Slider
              aria-label="timeline"
              defaultValue={0}
              max={duration / 1e3}
              min={0}
              onChange={handleSliderChange}
              size="small"
              sx={{ color: 'white' }}
              value={time / 1e3}
              valueLabelDisplay="auto"
              valueLabelFormat={timecode}
            />
          </Stack>
        </Container>
      </Box>
      {!singlePlayer ? (
        <audio
          controls
          muted
          // @ts-ignore
          ref={reference}
          onPlay={onPlay}
          onPause={onPause}
          style={{ display: 'none' }}
        />
      ) : null}
    </Root>
  );
};

const Player = ({
  media: { id, url, poster, title },
  players,
  active,
  setActive,
  playing,
  setPlaying,
  time = 0,
  setBuffering,
}) => {
  const ref = useRef();
  // console.log(ref);
  // console.log(ref.current?.getInternalPlayer('hls'));

  const [controls, setControls] = useState(false);
  const [primed, setPrimed] = useState(!MATCH_URL_YOUTUBE.test(url));
  const config = useMemo(
    () => ({
      file: {
        attributes: {
          poster,
          preload: 'none',
          playsinline: 'true',
          // muted: 'true',
        },
        // hlsOptions: {
        //   backBufferLength: 30,
        //   maxMaxBufferLength: 30,
        // },
      },
    }),
    [poster],
  );

  useEffect(() => {
    if (Math.abs(ref.current.getCurrentTime() * 1e3 - time) > 500) {
      console.log('SEEK', time, ref.current.getCurrentTime(), ref.current.getCurrentTime() * 1e3 - time);
      ref.current.seekTo(time / 1e3, 'seconds');
    }
  }, [ref, time]);

  // const initTime = useMemo(() => Date.now(), []);

  const waitForPlayer = useCallback(() => {
    // console.log('MUX?');
    setControls(!ref.current?.getInternalPlayer('hls'));
    if (ref.current?.getInternalPlayer('hls') && global.MUX_KEY) {
      console.log('MUX ON');
      const initTime = Date.now();
      mux.monitor(ref.current.getInternalPlayer(), {
        debug: false,
        hlsjs: ref.current?.getInternalPlayer('hls'),
        data: {
          env_key: global.MUX_KEY,
          player_name: 'Theatre',
          player_init_time: initTime,
          video_id: id,
          video_title: title,
        },
      });
    } else if (global.MUX_KEY) {
      setTimeout(() => waitForPlayer(), (1e3 * 1) / 60); // TODO use reqAnimFrame
    }
  }, [ref]);

  useEffect(() => waitForPlayer(), [waitForPlayer]);

  const onReady = useCallback(() => {
    players.current[id] = ref.current;
    if (!primed) {
      // setPlaying(id); // TODO make this via ref?
      // setActive(id);
    }
    //
    // if (ref.current?.getInternalPlayer('hls') && global.MUX_KEY) {
    // console.log('MUX ON');
    // const initTime = Date.now();
    // mux.monitor(ref.current.getInternalPlayer(), {
    //   debug: false,
    //   data: {
    //     env_key: global.MUX_KEY,
    //     player_name: 'Theatre',
    //     player_init_time: initTime,
    //     video_id: id,
    //   },
    // });

    // mux.monitor(ref.current.getInternalPlayer(), {
    //   debug: false,
    //   hlsjs: ref.current?.getInternalPlayer('hls'),
    //   data: {
    //     env_key: global.MUX_KEY,
    //     player_name: 'Theatre',
    //     player_init_time: initTime,
    //     video_id: id,
    //     video_title: title,
    //   },
    // });
    // console.log({
    //   // env_key: global.MUX_KEY,
    //   player_name: 'Theatre',
    //   player_init_time: initTime,
    //   video_id: id,
    //   video_title: title,
    // });
    // }
    //
  }, [id, primed]);

  const onPlay = useCallback(() => {
    // setPlaying(id);
    // setActive(id);
    if (!primed) {
      setPrimed(true);
      // setPlaying(false); // TODO make this via ref?
    }
  }, [id, primed]);

  // const onPause = useCallback(() => {
  //   // setPlaying(false);
  // }, []);

  // const onSeek = useCallback(() => {
  //   // console.log('seek', id);
  //   // setActive(id);
  // }, [id]);

  // const onProgress = useCallback(
  //   progress => {
  //     // console.log(progress);
  //     // setActive(id);
  //   },
  //   [id],
  // );

  const onBuffer = useCallback(() => {
    // console.log('onBuffer', id);
    setBuffering(true);
  }, [id, setBuffering]);

  const onBufferEnd = useCallback(() => {
    // console.log('onBufferEnd', id);
    setBuffering(false);
  }, [id, setBuffering]);

  return (
    <Box
      sx={{
        position: 'relative',
        paddingTop: '56.25%',
        '& .reactPlayer': { position: 'absolute', top: 0, left: 0 },
      }}
    >
      <ReactPlayer
        {...{ ref, config, url, playing, onReady, onPlay, onBuffer, onBufferEnd }}
        className="reactPlayer"
        controls={controls}
        height="100%"
        key={id}
        muted={controls}
        width="100%"
        // muted={!primed}
      />
    </Box>
  );
};

const SinglePlayer = React.forwardRef(
  (
    {
      media: { id, url, poster, title },
      playing,
      setBuffering,
      reference,
      onPlay,
      onPause,
      setTime,
      singlePlayerOffset,
    },
    ref,
  ) => {
    const [controls, setControls] = useState(false);
    const config = useMemo(
      () => ({
        file: {
          attributes: {
            poster,
            preload: 'none',
            playsinline: 'true',
            // muted: 'true',
          },
        },
      }),
      [poster],
    );

    const initTime = useMemo(() => Date.now(), []);

    const waitForPlayer = useCallback(() => {
      // console.log('MUX?');
      setControls(!ref.current?.getInternalPlayer('hls'));
      if (ref.current?.getInternalPlayer('hls') && global.MUX_KEY) {
        console.log('MUX ON');
        // const initTime = Date.now();
        mux.monitor(ref.current.getInternalPlayer(), {
          debug: false,
          hlsjs: ref.current?.getInternalPlayer('hls'),
          data: {
            env_key: global.MUX_KEY,
            player_name: 'Theatre',
            player_init_time: initTime,
            video_id: id,
            video_title: title,
          },
        });
      } else if (global.MUX_KEY) {
        setTimeout(() => waitForPlayer(), (1e3 * 1) / 60); // TODO use reqAnimFrame
      }
    }, [ref, initTime]);

    useEffect(() => waitForPlayer(), [waitForPlayer]);

    // const onReady = useCallback(() => {
    //   // players.current[id] = ref.current;
    //   if (!primed) {
    //     // setPlaying(id); // TODO make this via ref?
    //     // setActive(id);
    //   }
    // }, [id, primed]);

    // const onPlay = useCallback(() => {
    //   if (!primed) {
    //     setPrimed(true);
    //     // setPlaying(false); // TODO make this via ref?
    //   }
    // }, [id, primed]);

    // const onPause = useCallback(() => {
    //   // setPlaying(false);
    // }, []);

    // const onSeek = useCallback(() => {
    //   // console.log('seek', id);
    //   // setActive(id);
    // }, [id]);

    // const onProgress = useCallback(
    //   progress => {
    //     // console.log(progress);
    //     // setActive(id);
    //   },
    //   [id],
    // );

    const onBuffer = useCallback(() => {
      // setBuffering(true);
    }, [id, setBuffering]);

    const onBufferEnd = useCallback(() => {
      // setBuffering(false);
    }, [id, setBuffering]);

    const onProgress = useCallback(
      ({ playedSeconds }) => {
        setTime(playedSeconds * 1e3 - singlePlayerOffset);
      },
      [setTime, singlePlayerOffset],
    );

    return (
      <Box
        sx={{
          position: 'relative',
          paddingTop: '56.25%',
          '& .reactPlayer': { position: 'absolute', top: 0, left: 0 },
        }}
      >
        <ReactPlayer
          {...{ config, url, playing, onPlay, onPause, onBuffer, onBufferEnd, onProgress }}
          className="reactPlayer"
          // controls={controls}
          // muted={controls}
          key={id}
          width="100%"
          height="100%"
          ref={ref}
          progressInterval={100}
        />
        {title && (
          <Box className={classes.posterTitle} sx={{ opacity: playing ? 0 : 1 }}>
            <Typography component="h2" variant="h6">
              <span>{title}</span>
            </Typography>
          </Box>
        )}
      </Box>
    );
  },
);

const timecode = (seconds, frameRate = 25, dropFrame = false) =>
  TC(seconds * 25, 25, false)
    .toString()
    .split(':')
    .slice(0, 3)
    .join(':');
