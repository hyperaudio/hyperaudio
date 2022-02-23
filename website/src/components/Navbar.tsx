import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import { styled } from "@mui/material/styles";

import { useThrottledResizeObserver } from "@hyperaudio/common";

import Link from "./Link";

import { menu } from "../config/menu";

// interface Props {
// children: React.ReactElement;
// }

const PREFIX = `Navbar`;
const classes = {
  button: `${PREFIX}-button`,
  root: `${PREFIX}-root`,
  toolbar: `${PREFIX}-toolbar`,
};

const Root = styled(AppBar, {
  // shouldForwardProp: (prop: any) => prop !== 'isActive',
})(({ theme }) => ({
  [`& .${classes.toolbar}`]: {
    alignContent: "stretch",
    alignItems: "stretch",
    background: theme.palette.background.default,
    borderTop: `1px solid ${theme.palette.action.focus}`,
    boxShadow: theme.shadows[24],
    display: "flex",
    flexDirection: "row",
    [`& > *`]: {
      flex: `0 0 ${100 / 3}%`,
    },
  },
  [`& .${classes.button}`]: {
    alignItems: "center",
    color: theme.palette.primary.main,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    paddingBottom: theme.spacing(0),
    paddingTop: theme.spacing(0),
    textDecoration: "none",
    width: "100%",
    [`&:hover`]: {
      background: theme.palette.action.hover,
    },
    [`&:not(:last-child)`]: {
      borderRight: `1px solid ${theme.palette.action.focus}`,
    },
  },
}));

const Navbar = () => {
  const { ref, height = 0 } = useThrottledResizeObserver(500);
  return (
    <>
      <Box
        sx={{
          height: `${height}px`,
          display: { xs: "block", md: "none" },
        }}
      />
      <Root
        className={classes.root}
        color="default"
        enableColorOnDark
        position="fixed"
        ref={ref}
        sx={{ display: { xs: "block", md: "none" }, top: "auto", bottom: 0 }}
      >
        <Toolbar disableGutters className={classes.toolbar}>
          {menu.map(({ href, label }) => (
            <Link
              key={href}
              className={classes.button}
              href={href}
              variant="button"
            >
              {label}
            </Link>
          ))}
        </Toolbar>
      </Root>
    </>
  );
};

export default Navbar;
