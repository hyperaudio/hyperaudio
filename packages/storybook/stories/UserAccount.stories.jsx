import React from "react";

import { AccountView } from "@hyperaudio/app/src/views";
import { data } from "./data/dashboard-data";

export default {
  title: "App/AccountView",
  component: AccountView,
};

const AccountTpl = (args) => (
  <div style={{ height: "100vh" }}>
    <AccountView {...data} {...args} />
  </div>
);

export const Account = AccountTpl.bind({});
Account.args = {};
