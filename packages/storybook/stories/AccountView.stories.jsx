import React, { useReducer } from "react";

import { AccountView } from "@hyperaudio/app/src/views";
import { accountReducer } from "@hyperaudio/app/src/reducers";

import { appData } from "./data";

export default {
  title: "App/AccountView",
  component: AccountView,
};

const AccountTpl = (args) => {
  const [account, dispatch] = useReducer(accountReducer, {
    name: appData.account.name,
    bio: appData.account.bio,
  });

  return (
    <div style={{ height: "100vh" }}>
      <AccountView account={account} dispatch={dispatch} {...args} />
    </div>
  );
};

export const Account = AccountTpl.bind({});
Account.args = {};
