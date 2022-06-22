import React from "react";

import { RolesTable } from "@hyperaudio/common";
import { appData } from "./data";

export default {
  title: "Common/RolesTable",
  component: RolesTable,
};

const RolesTpl = (args) => (
  <div style={{ height: "100vh" }}>
    <RolesTable {...appData} {...args} />
  </div>
);

export const Default = RolesTpl.bind({});
Default.args = {
  onChangeMemberRole: (payload) =>
    console.log("onChangeMemberRole", { payload }),
  onAddMember: (payload) => console.log("onAddMember", { payload }),
  onDeleteMembers: (payload) => console.log("onDeleteMembers", { payload }),
};
