import React, { useRef, useMemo, useCallback, useEffect, useState } from "react";

import { Editor, EditorState, convertFromRaw, createEntityMap } from "@hyperaudio/editor";

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
      blocks: transcript.blocks.map(({ text, data: { speaker, start, end, items } }) => ({
        text,
        data: { speaker, start, end, items },
        entityRanges: [],
        inlineStyleRanges: [],
      })),
    }),
    [],
  );

  const initialState = useMemo(
    () => EditorState.createWithContent(convertFromRaw({ blocks, entityMap: createEntityMap(blocks) })),
    [blocks],
  );

  useEffect(() => audio.current?.addEventListener('timeupdate', () => setTime(audio.current.currentTime)), [audio]);

  const seekTo = useCallback(
    time => {
      if (audio.current) audio.current.currentTime = time;
    },
    [audio],
  );

  const showDialog = useCallback(({ target, x, y, block, data }) => {
    alert(`${data.speaker}`);
  }, []);

  return (
    <div style={{ height: "100vh" }}>
      <audio
        controls
        ref={audio}
        src="https://hyperaudio-a0e962a7c406.s3.eu-west-1.amazonaws.com/input/YVBNsWgjvPkGpubCchh2e5/audio/YVBNsWgjvPkGpubCchh2e5.m4a"
        style={{ width: "100%" }}
      ></audio>
      <Editor {...{ initialState, time, seekTo, showDialog, speakers, ...args }} />
    </div>
  );
};

export const NormalEditor = Template.bind({});
NormalEditor.args = {};
