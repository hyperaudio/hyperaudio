import * as React from "react";

import { styled } from "@mui/material/styles";

import { Main, Topbar } from "@hyperaudio/app/src/components";

const PREFIX = `UserAccount`;
const classes = {
  root: `${PREFIX}-Root`,
};

const Root = styled("div", {})(({ theme }) => ({}));

export function UserAccount(props) {
  const { organization, account } = props;
  return (
    <Root className={classes.root}>
      <Topbar account={account} organization={organization} />
      <Main>Hello World</Main>
    </Root>
  );
}
