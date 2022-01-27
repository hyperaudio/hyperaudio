import React from "react";

import { DashboardView } from "@hyperaudio/app/src/views";
import { appData } from "./data";

export default {
  title: "App/DashboardView",
  component: DashboardView,
};

const DashboardTpl = (args) => (
  <div style={{ height: "100vh" }}>
    <DashboardView {...appData} {...args} />
  </div>
);

export const Dashboard = DashboardTpl.bind({});
Dashboard.args = {};
