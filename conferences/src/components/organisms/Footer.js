import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import Link from '@mui/material/Link';
import Slide from '@mui/material/Slide';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import { styled } from '@mui/material/styles';

import { HyperaudioIcon } from '@hyperaudio/common';

const PREFIX = 'Footer';
const classes = {
  foot: `${PREFIX}-foot`,
};

const Root = styled('div', {
  // shouldForwardProp: (prop: any) => prop !== 'isActive',
})(({ theme }) => ({
  [`& .${classes.foot}`]: {
    background: theme.palette.background.paper,
    borderColor: theme.palette.divider,
    borderStyle: 'solid',
    bottom: 0,
    padding: theme.spacing(0.5, 1),
    position: 'fixed',
  },
}));

export default function Footer() {
  const trigger = useScrollTrigger();
  const linkProps = {
    sx: { fontSize: '12px', mh: 1 },
    target: '_blank',
    underline: 'hover',
    variant: 'caption',
  };
  return (
    <Root className={classes.footer}>
      <Tooltip title="Visit Hyperaudio" placement="top">
        <Fab
          color="primary"
          href="https://hyper.audio"
          sx={{
            bottom: { xs: 30, md: 40, lg: 50 },
            display: { xs: 'none', md: 'inline-flex' },
            position: 'fixed',
            right: { xs: 30, md: 40, lg: 50 },
          }}
          target="_blank"
        >
          <HyperaudioIcon />
        </Fab>
      </Tooltip>
      <Slide appear={false} direction="up" in={!trigger}>
        <Box className={classes.foot} sx={{ left: 0, borderWidth: '1px 1px 0 0' }}>
          <Stack direction="row" spacing={1}>
            <Typography color="textSecondary" variant="caption" sx={{ fontSize: '12px' }}>
              ©{' '}
              <Link {...linkProps} href="https://hyper.audio">
                The Hyperaudio Project
              </Link>
            </Typography>
          </Stack>
        </Box>
      </Slide>
      <Slide appear={false} direction="up" in={!trigger}>
        <Box className={classes.foot} sx={{ right: 0, borderWidth: '1px 0 0 1px' }}>
          <Stack direction="row" spacing={2}>
            <Link {...linkProps} href="https://hyper.audio/terms-of-service">
              Terms of Service
            </Link>
            <Link
              {...linkProps}
              href="https://hyper.audio/privacy-policy"
              sx={{ ...linkProps.sx, display: { xs: 'none', sm: 'inline' } }}
            >
              Privacy Policy
            </Link>
            <Link
              {...linkProps}
              href="https://hyper.audio/code-of-conduct"
              sx={{ ...linkProps.sx, display: { xs: 'none', md: 'inline' } }}
            >
              Code of Conduct
            </Link>
          </Stack>
        </Box>
      </Slide>
    </Root>
  );
}
