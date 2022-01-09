import React from "react";

import { Dashboard } from "../../app/src/Dashboard.js";
// import { data } from "./data/remixer-data";

export default {
  title: "App/Dashboard",
  component: Dashboard,
};

const DashboardTpl = (args) => (
  <div style={{ height: "100vh" }}>
    <Dashboard {...args} />
  </div>
);

export const DashboardView = DashboardTpl.bind({});
DashboardView.args = {};
