import * as React from "react";

import Container from "@mui/material/Container";
import { styled } from "@mui/material/styles";

const PREFIX = `Main`;
const classes = {
  root: `${PREFIX}-Root`,
};

const Root = styled(
  "main",
  {}
)(({ theme }) => ({
  padding: theme.spacing(8, 0),
}));

export function Main(props) {
  const { children } = props;
  return (
    <Root className={classes.root}>
      <Container maxWidth="none">{children}</Container>
    </Root>
  );
}
