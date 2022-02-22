import type { NextPage } from "next";

import { styled } from "@mui/material/styles";

interface PageProps {
  yOffset: Number;
}

const PREFIX = `HomePage`;
const classes = {
  root: `${PREFIX}-root`,
};

const Root = styled("div", {
  // shouldForwardProp: (prop: any) => prop !== 'isActive',
})(({ theme }) => ({}));

const HomePage: NextPage<PageProps> = (props: PageProps) => {
  const { yOffset } = props;

  return <Root className={classes.root}>Hello Home Page</Root>;
};

export default HomePage;
