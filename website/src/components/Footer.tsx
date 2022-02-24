import React from 'react';

import Container from '@mui/material/Container';
import GitHubIcon from '@mui/icons-material/GitHub';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import TwitterIcon from '@mui/icons-material/Twitter';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

// import { Brandmark, TwitchIcon, DiscordIcon } from '@tt/common';
import { HyperaudioMain } from '@hyperaudio/common';

import Link from './Link';
import { config } from '../config';

// interface Props {
// children: React.ReactElement;
// }

const PREFIX = `Footer`;
const classes = {
  root: `${PREFIX}-root`,
};

const Root = styled('footer', {
  // shouldForwardProp: (prop: any) => prop !== 'isActive',
})(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  backgroundImage: 'url("/images/grain.png")',
  backgroundPosition: 'center center',
  backgroundRepeat: 'repeat',
  color: theme.palette.primary.contrastText,
}));

const Footer = () => (
  <Root className={classes.root}>
    <Container maxWidth="xl" fixed sx={{ py: { xs: 8, md: 16 } }}>
      <Grid alignItems="center" container spacing={{ xs: 3, md: 6 }}>
        <Grid item xs={12} lg={8} sx={{ textAlign: { xs: 'center', lg: 'left' } }}>
          <HyperaudioMain size="large" />
          <Typography gutterBottom variant="caption" component="p" color="primary.contrastText" sx={{ mb: 1 }}>
            © The Hyperaudio Project. All Rights Reserved.
          </Typography>
          <Typography gutterBottom variant="caption" component="p" color="primary.contrastText">
            <Link href="/privacy-policy" color="primary.contrastText">
              Privacy Policy
            </Link>
            ,{' '}
            <Link href="/terms-of-service" color="primary.contrastText">
              Terms of Service
            </Link>
            ,{' '}
            <Link href="/code-of-conduct" color="primary.contrastText">
              Code of conduct
            </Link>
            .
          </Typography>
        </Grid>
        <Grid item xs={12} lg={4} sx={{ textAlign: { xs: 'center', lg: 'right' } }}>
          <Tooltip title={config.elsewhere.github.tip}>
            <IconButton href={config.elsewhere.github.url} sx={{ mx: { xs: 0.5, md: 1 } }} color="inherit">
              <GitHubIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={config.elsewhere.twitter.tip}>
            <IconButton href={config.elsewhere.twitter.url} sx={{ mx: { xs: 0.5, md: 1 } }} color="inherit">
              <TwitterIcon />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
    </Container>
  </Root>
);

export default Footer;
