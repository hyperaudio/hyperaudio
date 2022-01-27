import React from "react";

import { RolesView } from "@hyperaudio/app/src/views";
import { appData } from "./data";

export default {
  title: "App/RolesView",
  component: RolesView,
};

const RolesTpl = (args) => (
  <div style={{ height: "100vh" }}>
    <RolesView {...appData} {...args} />
  </div>
);

export const Roles = RolesTpl.bind({});
Roles.args = {};
