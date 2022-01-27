import React from "react";

import { DashboardView } from "@hyperaudio/app/src/views";
import { data } from "./data/dashboard-data";

export default {
  title: "App/DashboardView",
  component: DashboardView,
};

const DashboardTpl = (args) => (
  <div style={{ height: "100vh" }}>
    <DashboardView {...data} {...args} />
  </div>
);

export const Dashboard = DashboardTpl.bind({});
Dashboard.args = {};
