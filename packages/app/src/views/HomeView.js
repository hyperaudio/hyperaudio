import * as React from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CheckIcon from "@mui/icons-material/Check";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

import { Main, Topbar } from "@hyperaudio/app/src/components";

const PREFIX = `HomeView`;
const classes = {
  root: `${PREFIX}-Root`,
};

const Root = styled("div", {})(({ theme }) => ({}));

export function HomeView(props) {
  const { organization, account } = props;
  return (
    <Root className={classes.root}>
      <Topbar
        account={account}
        organization={organization}
        title={organization.name}
      />
      <Main>Hello Home Page</Main>
    </Root>
  );
}
