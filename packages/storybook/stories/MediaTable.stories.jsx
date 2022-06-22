import React from "react";

import { MediaTable } from "@hyperaudio/common";
import { appData } from "./data";

export default {
  title: "Common/MediaTable",
  component: MediaTable,
};

const MediaTableTpl = (args) => (
  <div style={{ height: "100vh" }}>
    <MediaTable {...appData} {...args} />
  </div>
);

export const Default = MediaTableTpl.bind({});
Default.args = {
  onDeleteMedia: (payload) => console.log("onDeleteMedia", { payload }),
  onEditMedia: (payload) => console.log("onEditMedia", { payload }),
  onTranslateMedia: (payload) => console.log("onTranslateMedia", { payload }),
};
