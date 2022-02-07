import React from "react";

import { MediaView } from "@hyperaudio/app/src/views";
import { appData } from "./data";

export default {
  title: "App/MediaView",
  component: MediaView,
};

const channels = appData.channels.map((channel) => {
  const media = _.filter(
    appData.media,
    (o) => o.channelId === channel.channelId
  );
  return { ...channel, media };
});

const MediaTpl = (args) => (
  <div style={{ height: "100vh" }}>
    <MediaView {...appData} channels={channels} {...args} />
  </div>
);

export const Media = MediaTpl.bind({});
Media.args = {};
