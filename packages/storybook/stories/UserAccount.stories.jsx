import React from "react";

import { UserAccount } from "../../app/src/views/UserAccount.js";
import { data } from "./data/dashboard-data";

export default {
  title: "App/UserAccount",
  component: UserAccount,
};

const UserAccountTpl = (args) => (
  <div style={{ height: "100vh" }}>
    <UserAccount {...data} {...args} />
  </div>
);

export const UserAccountView = UserAccountTpl.bind({});
UserAccountView.args = {};
