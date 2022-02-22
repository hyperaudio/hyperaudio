import { useEffect, Dispatch, SetStateAction } from 'react';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Toolbar from '@mui/material/Toolbar';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import { grey } from '@mui/material/colors';
import { styled } from '@mui/material/styles';

import { Brandmark, useThrottledResizeObserver } from '@hyperaudio/common';

import Link from './Link';
import { links } from '../config/links';
import { menu } from '../config/menu';

interface RootProps {
  useGrain?: Boolean;
}
interface TopbarProps {
  setOffset: Dispatch<SetStateAction<number>>;
}

const PREFIX = `Topbar`;
const classes = {
  push: `${PREFIX}-push`,
  root: `${PREFIX}-root`,
  side: `${PREFIX}-side`,
  sideL: `${PREFIX}-sideL`,
  sideR: `${PREFIX}-sideR`,
};

const Root = styled(AppBar, {
  shouldForwardProp: (prop: any) => !['useGrain'].includes(prop),
})<RootProps>(({ theme, useGrain }) => ({
  backgroundImage: useGrain ? `linear-gradient(to top right, ${grey[300]}, ${grey[50]})` : 'none',
  color: theme.palette.text.primary,
  transition: `background ${theme.transitions.duration.standard}`,
  [`&:before`]: {
    bottom: 0,
    content: '" "',
    left: 0,
    pointerEvents: 'none',
    position: 'absolute',
    right: 0,
    top: 0,
  },
}));

const Topbar = (props: TopbarProps) => {
  const { setOffset } = props;
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 0 });
  const { ref, height = 0 } = useThrottledResizeObserver(500);

  useEffect(() => setOffset(height), [height]);

  return (
    <>
      <Root
        className={classes.root}
        color="transparent"
        elevation={trigger ? 6 : 0}
        enableColorOnDark
        position="fixed"
        ref={ref}
        useGrain={Boolean(trigger)}
      >
        <Container maxWidth={false} sx={{ py: { xs: 1, md: 2, xl: 3 } }}>
          <Toolbar disableGutters>
            <Grid container alignItems="center">
              <Grid item xs={6} md={3}>
                <Link
                  display="inline-block"
                  href="/"
                  sx={{
                    color: 'text.primary',
                    '&:hover': { color: 'primary.main' },
                  }}
                >
                  <Brandmark />
                </Link>
              </Grid>
              <Grid
                alignItems="center"
                container
                item
                justifyContent="center"
                sx={{ display: { xs: 'none', md: 'flex' } }}
                xs
              >
                {menu.map(({ href, label }) => (
                  <Button
                    color="primary"
                    component={Link}
                    href={href}
                    key={href}
                    noLinkStyle
                    sx={{
                      mx: { xs: 1, md: 2 },
                    }}
                  >
                    {label}
                  </Button>
                ))}
              </Grid>
              <Grid item xs={6} md={3} container justifyContent="flex-end">
                <Button color="primary" variant="contained" href={links.signup}>
                  Sign up
                </Button>
              </Grid>
            </Grid>
          </Toolbar>
        </Container>
      </Root>
      <Box
        sx={{
          height: `${height}px`,
        }}
      />
    </>
  );
};

export default Topbar;
