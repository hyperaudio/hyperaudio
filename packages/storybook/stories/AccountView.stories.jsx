import React from "react";

import { AccountView } from "@hyperaudio/app/src/views";
import { appData } from "./data";

export default {
  title: "App/AccountView",
  component: AccountView,
};

const AccountTpl = (args) => (
  <div style={{ height: "100vh" }}>
    <AccountView {...appData} {...args} />
  </div>
);

export const Account = AccountTpl.bind({});
Account.args = {};
