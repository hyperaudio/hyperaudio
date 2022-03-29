import React, {
  useRef,
  useMemo,
  useCallback,
  useEffect,
  useState,
} from "react";

import ReactPlayer from 'react-player';

import FastForwardIcon from '@mui/icons-material/FastForward';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Slider from '@mui/material/Slider';

import {
  Editor,
  EditorState,
  convertFromRaw,
  createEntityMap,
} from "@hyperaudio/editor";

import transcript from "./data/transcripts/YVBNsWgjvPkGpubCchh2e5-transcript.json";

export default {
  title: "Packages/Editor",
  component: Editor,
};

const Template = (args) => {
  const audio = useRef();
  const [time, setTime] = useState(0);

  const { speakers, blocks } = useMemo(
    () => ({
      speakers: transcript.speakers,
      blocks: transcript.blocks.map(
        ({ text, data: { speaker, start, end, items } }) => ({
          text,
          data: { speaker, start, end, items },
          entityRanges: [],
          inlineStyleRanges: [],
        })
      ),
    }),
    []
  );

  const initialState = useMemo(
    () =>
      EditorState.createWithContent(
        convertFromRaw({ blocks, entityMap: createEntityMap(blocks) })
      ),
    [blocks]
  );

  useEffect(
    () =>
      audio.current?.addEventListener("timeupdate", () =>
        setTime(audio.current.currentTime)
      ),
    [audio]
  );

  const seekTo = useCallback(
    (time) => {
      setSeekTime(time);
      if (audio.current) audio.current.currentTime = time;
      if (video.current) video.current.seekTo(time, 'seconds');
    },
    [audio, video]
  );

  const video = useRef();
  const poster = 'https://hyperaudio-a0e962a7c406.s3.eu-west-1.amazonaws.com/HLS/YVBNsWgjvPkGpubCchh2e5/FullImage_000000046.jpg';
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

  const [seekTime, setSeekTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [buffering, setBuffering] = useState(false);

  const onProgress = useCallback(({ playedSeconds }) => setTime(playedSeconds), []);
  const play = useCallback(() => setPlaying(true), []);
  const pause = useCallback(() => setPlaying(false), []);
  const handleSliderChange = useCallback((event, value) => {
    setSeekTime(value);
    if (audio.current) audio.current.currentTime = value;
    if (video.current) video.current.seekTo(value, 'seconds');
  }, [audio, video]);
  const onBuffer = useCallback(() => setBuffering(true), []);
  const onBufferEnd = useCallback(() => setBuffering(false), []);
  const onDuration = useCallback(duration => setDuration(duration), []);


  return (
    <div style={{ height: "100vh", maxWidth: "600px", margin: "0 auto" }}>
      {/* <audio
        controls
        ref={audio}
        src="https://hyperaudio-a0e962a7c406.s3.eu-west-1.amazonaws.com/input/YVBNsWgjvPkGpubCchh2e5/audio/YVBNsWgjvPkGpubCchh2e5.m4a"
        style={{ width: "100%" }}
      ></audio> */}
      <div style={{marginBottom: 40}}>
        <ReactPlayer
          width="100%"
          ref={video}
          config={config}
          playing={playing}
          url="https://hyperaudio-a0e962a7c406.s3.eu-west-1.amazonaws.com/HLS/YVBNsWgjvPkGpubCchh2e5/YVBNsWgjvPkGpubCchh2e5.m3u8"
          onProgress={onProgress}
          onBuffer={onBuffer}
          onBufferEnd={onBufferEnd}
          onPlay={play}
          onDuration={onDuration}
          progressInterval={100}
        />
        <div>
          <Grid container spacing={2} sx={{ alignItems: 'center' }}>
            <Grid item>
              {buffering && seekTime !== time ? (
                <IconButton onClick={pause} size="small">
                  {seekTime - time > 0 ? <FastForwardIcon /> : <FastRewindIcon />}
                </IconButton>
              ) : playing ? (
                <IconButton onClick={pause} size="small">
                  <PauseIcon />
                </IconButton>
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
                max={duration}
                min={0}
                onChange={handleSliderChange}
                size="small"
                value={time}
                valueLabelDisplay="auto"
              />
            </Grid>
          </Grid>
        </div>
      </div>
      <Editor
        {...{ initialState, time, seekTo, speakers, ...args }}
      />
    </div>
  );
};

export const NormalEditor = Template.bind({});
NormalEditor.args = {};
