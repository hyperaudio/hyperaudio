import React from "react";

import { Remixer } from "../../remixer/src/index.js";
import data from "./remixer.data.json";

export default {
  title: "Packages/Remixer",
  component: Remixer,
};

const Template = (args) => (
  <div style={{ height: "100vh" }}>
    <Remixer remix={data.remix} sources={data.sources} media={[]} {...args} />
  </div>
);

export const ReadMode = Template.bind({});
ReadMode.args = {
  editable: false,
};
export const ReadModeOneSource = Template.bind({});
ReadModeOneSource.args = {
  editable: false,
  sources: [data.sources[0]],
};

export const EmptyRemix = Template.bind({});
EmptyRemix.args = {
  editable: true,
  remix: { ...data.remix, secret: false, title: "", blocks: [] },
};
export const RichRemix = Template.bind({});
RichRemix.args = {
  editable: true,
  remix: { ...data.remix, secret: false, title: "" },
};
export const OneSource = Template.bind({});
OneSource.args = {
  editable: true,
  remix: { ...data.remix, title: "" },
  sources: [data.sources[0]],
};
export const LibraryEmpty = Template.bind({});
LibraryEmpty.args = {
  editable: true,
  remix: { ...data.remix, title: "" },
  media: [],
};
export const RichLibrary = Template.bind({});
RichLibrary.args = {
  editable: true,
  remix: { ...data.remix, title: "" },
  media: [...data.sources],
};
export const SearchResults = Template.bind({});
SearchResults.args = {
  editable: true,
  remix: { ...data.remix, title: "" },
  media: [...data.sources],
  matches: { transcripts: [...data.sources], titles: [...data.sources] },
};
export const SearchSome = Template.bind({});
SearchSome.args = {
  editable: true,
  remix: { ...data.remix, title: "" },
  media: [...data.sources],
  matches: { transcripts: [...data.sources], titles: null },
};
export const SearchNull = Template.bind({});
SearchNull.args = {
  editable: true,
  remix: { ...data.remix, title: "" },
  media: [...data.sources],
  matches: { transcripts: null, titles: null },
};
