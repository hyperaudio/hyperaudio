import React from "react";

import { Dashboard } from "../../app/src/views/Dashboard.js";
import { data } from "./data/dashboard-data";

export default {
  title: "App/Dashboard",
  component: Dashboard,
};

const DashboardTpl = (args) => (
  <div style={{ height: "100vh" }}>
    <Dashboard {...data} {...args} />
  </div>
);

export const DashboardView = DashboardTpl.bind({});
DashboardView.args = {};
