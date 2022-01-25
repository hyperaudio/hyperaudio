import React from "react";

import { Roles } from "@hyperaudio/app/src/views/Roles";
import { data } from "./data/dashboard-data";

export default {
  title: "App/Roles",
  component: Roles,
};

const RolesViewTpl = (args) => (
  <div style={{ height: "100vh" }}>
    <Roles {...data} {...args} />
  </div>
);

export const RolesView = RolesViewTpl.bind({});
RolesView.args = {};
