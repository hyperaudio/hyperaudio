import Container from "@mui/material/Container";
import GitHubIcon from "@mui/icons-material/GitHub";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import TwitterIcon from "@mui/icons-material/Twitter";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

// import { Brandmark, TwitchIcon, DiscordIcon } from '@tt/common';

import Link from "./Link";
import { links } from "../config";

// interface Props {
// children: React.ReactElement;
// }

const PREFIX = `Footer`;
const classes = {
  root: `${PREFIX}-root`,
};

const Root = styled("footer", {
  // shouldForwardProp: (prop: any) => prop !== 'isActive',
})(({ theme }) => ({
  background: theme.palette.background.default,
  color: theme.palette.text.primary,
}));

const Footer = () => (
  <Root className={classes.root}>
    <Container maxWidth="xl" fixed sx={{ py: { xs: 6, lg: 12 } }}>
      <Grid alignItems="center" container spacing={{ xs: 3, md: 6 }}>
        <Grid
          item
          xs={12}
          lg={8}
          sx={{ textAlign: { xs: "center", lg: "left" } }}
        >
          <Typography gutterBottom>Hyperaudio</Typography>
          <Typography color="textSecondary" variant="body2" component="p">
            There is something written here about what TinyTable is, licencing.
          </Typography>
          <Typography color="textSecondary" variant="body2" component="p">
            There may even be copyright, and{" "}
            <Link href="/privacy-policy">Privacy Policy</Link> and possibly{" "}
            <Link href="/terms-of-service">Terms of Service</Link>.
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          lg={4}
          sx={{ textAlign: { xs: "center", lg: "right" } }}
        >
          <Tooltip title="Hyperaudio on Github">
            <IconButton
              href={links.github}
              sx={{ mr: { xs: 1, md: 0 }, ml: { xs: 1 } }}
            >
              <GitHubIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Hyperaudio on Twitter">
            <IconButton
              href={links.twitter}
              sx={{ mr: { xs: 1, md: 0 }, ml: { xs: 1 } }}
            >
              <TwitterIcon />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
    </Container>
  </Root>
);

export default Footer;
