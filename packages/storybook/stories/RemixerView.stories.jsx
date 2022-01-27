import React from "react";

import { RemixerView } from "@hyperaudio/app/src/views";
import { appData, remixData } from "./data";

export default {
  title: "App/RemixerView",
  component: RemixerView,
};

const RemixerViewTpl = (args) => (
  <div style={{ height: "100vh" }}>
    <RemixerView {...appData} {...remixData} {...args} />
  </div>
);

export const ReadMode = RemixerViewTpl.bind({});
ReadMode.args = {
  editable: false,
};

export const ReadModeOneSource = RemixerViewTpl.bind({});
ReadModeOneSource.args = {
  editable: false,
  sources: [remixData.sources[0]],
};

export const EmptyRemix = RemixerViewTpl.bind({});
EmptyRemix.args = {
  editable: true,
  remix: { ...remixData.remix, secret: false, title: "", blocks: [] },
};

export const RichRemix = RemixerViewTpl.bind({});
RichRemix.args = {
  editable: true,
  remix: { ...remixData.remix, secret: false, title: "" },
};

export const OneSource = RemixerViewTpl.bind({});
OneSource.args = {
  editable: true,
  remix: { ...remixData.remix, title: "" },
  sources: [remixData.sources[0]],
};

export const LibraryEmpty = RemixerViewTpl.bind({});
LibraryEmpty.args = {
  editable: true,
  remix: { ...remixData.remix, title: "" },
  media: [],
};

export const RichLibrary = RemixerViewTpl.bind({});
RichLibrary.args = {
  editable: true,
  remix: { ...remixData.remix, title: "" },
  sources: [remixData.sources[0]],
  media: [...remixData.sources],
};

export const SearchResults = RemixerViewTpl.bind({});
SearchResults.args = {
  editable: true,
  remix: { ...remixData.remix, title: "" },
  media: [...remixData.sources],
  matches: {
    transcripts: [...remixData.sources],
    titles: [...remixData.sources],
  },
};

export const SearchSome = RemixerViewTpl.bind({});
SearchSome.args = {
  editable: true,
  remix: { ...remixData.remix, title: "" },
  media: [...remixData.sources],
  matches: { transcripts: [...remixData.sources], titles: null },
};

export const SearchNull = RemixerViewTpl.bind({});
SearchNull.args = {
  editable: true,
  remix: { ...remixData.remix, title: "" },
  media: [...remixData.sources],
  matches: { transcripts: null, titles: null },
};
