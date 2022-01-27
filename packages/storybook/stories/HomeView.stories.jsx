import React from "react";

import { HomeView } from "@hyperaudio/app/src/views";
import { appData } from "./data";

export default {
  title: "App/HomeView",
  component: HomeView,
};

const HomeTpl = (args) => (
  <div style={{ height: "100vh" }}>
    <HomeView {...appData} {...args} />
  </div>
);

export const Home = HomeTpl.bind({});
Home.args = {};
