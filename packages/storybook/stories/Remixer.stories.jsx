import React from "react";

import Remixer from "@hyperaudio/remixer";

import { remixData } from "./data";

export default {
  title: "Packages/Remixer",
  component: Remixer,
};

const Template = (args) => (
  <div style={{ height: "100vh" }}>
    <Remixer
      remix={remixData.remix}
      sources={remixData.sources}
      media={[]}
      sx={{
        "& > *": { flex: "0 0 50%" },
        bottom: 0,
        display: "flex",
        left: 0,
        position: "absolute",
        right: 0,
        top: 0,
      }}
      {...args}
    />
  </div>
);

export const ReadMode = Template.bind({});
ReadMode.args = {
  editable: false,
};

export const ReadModeOneSource = Template.bind({});
ReadModeOneSource.args = {
  editable: false,
  sources: [remixData.sources[0]],
};

export const EmptyRemix = Template.bind({});
EmptyRemix.args = {
  editable: true,
  remix: { ...remixData.remix, secret: false, title: "", blocks: [] },
};

export const RichRemix = Template.bind({});
RichRemix.args = {
  editable: true,
  remix: { ...remixData.remix, secret: false, title: "" },
};

export const OneSource = Template.bind({});
OneSource.args = {
  editable: true,
  remix: { ...remixData.remix, title: "" },
  sources: [remixData.sources[0]],
  autoScroll: true,
};

export const LibraryEmpty = Template.bind({});
LibraryEmpty.args = {
  editable: true,
  remix: { ...remixData.remix, title: "" },
  media: [],
};

export const RichLibrary = Template.bind({});
RichLibrary.args = {
  editable: true,
  remix: { ...remixData.remix, title: "" },
  sources: [remixData.sources[0]],
  media: [...remixData.sources],
};

export const SearchResults = Template.bind({});
SearchResults.args = {
  editable: true,
  remix: { ...remixData.remix, title: "" },
  media: [...remixData.sources],
  matches: {
    transcripts: [...remixData.sources],
    titles: [...remixData.sources],
  },
};

export const SearchSome = Template.bind({});
SearchSome.args = {
  editable: true,
  remix: { ...remixData.remix, title: "" },
  media: [...remixData.sources],
  matches: { transcripts: [...remixData.sources], titles: null },
};

export const SearchNull = Template.bind({});
SearchNull.args = {
  editable: true,
  remix: { ...remixData.remix, title: "" },
  media: [...remixData.sources],
  matches: { transcripts: null, titles: null },
};

export const SingleMedia = Template.bind({});
SingleMedia.args = {
  editable: false,
  isSingleMedia: true,
  media: [...remixData.sources],
};
