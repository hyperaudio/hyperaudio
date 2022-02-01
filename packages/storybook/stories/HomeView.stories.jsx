import React from "react";

import { HomeView } from "@hyperaudio/app/src/views";
import { appData } from "./data";

export default {
  title: "App/HomeView",
  component: HomeView,
};

const channels = appData.channels.map((channel) => {
  const media = _.filter(
    appData.media,
    (o) => o.channelId === channel.channelId
  );
  return { ...channel, media };
});

const HomeTpl = (args) => (
  <div style={{ height: "100vh" }}>
    <HomeView {...appData} channels={channels} {...args} />
  </div>
);

export const Home = HomeTpl.bind({});
Home.args = {};
