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

export const EditModeEmpty = Template.bind({});
EditModeEmpty.args = {
  editable: true,
  remix: { ...data.remix, secret: false, title: "", blocks: [] },
};
export const EditMode = Template.bind({});
EditMode.args = {
  editable: true,
  remix: { ...data.remix, secret: false, title: "" },
};
export const EditModeOneSource = Template.bind({});
EditModeOneSource.args = {
  editable: true,
  remix: { ...data.remix, title: "" },
  sources: [data.sources[0]],
};
export const EditModeEmptyLibrary = Template.bind({});
EditModeEmptyLibrary.args = {
  editable: true,
  remix: { ...data.remix, title: "" },
  media: [],
};
export const EditModeRichLibrary = Template.bind({});
EditModeRichLibrary.args = {
  editable: true,
  remix: { ...data.remix, title: "" },
  media: [...data.sources],
};
export const EditModeLibrarySearch = Template.bind({});
EditModeLibrarySearch.args = {
  editable: true,
  remix: { ...data.remix, title: "" },
  media: [...data.sources],
  matches: [...data.sources],
};
