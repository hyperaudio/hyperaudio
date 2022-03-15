import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';

import { useRouter } from 'next/router';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import { grey } from '@mui/material/colors';
import { styled } from '@mui/material/styles';

import { HyperaudioConferences, HyperaudioMain, useThrottledResizeObserver } from '@hyperaudio/common';

import Link from './Link';
import { config } from '../config';

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
  const router = useRouter();
  const { pathname } = router;
  const { setOffset } = props;
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 0 });
  const { ref, height = 0 } = useThrottledResizeObserver(500);

  useEffect(() => setOffset(height), [height, setOffset]);

  const isConferences = pathname === '/conferences';

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  console.log({ pathname });

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
        <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', p: 1, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ fontWeight: 500, textTransform: 'none' }} color="primary.contrastText">
            New:{' '}
            <Link href="/conferences" color="inherit" underline="hover">
              Hyperaudio for Conferences {!pathname.includes('conferences') && <> — Visit now</>}
            </Link>
          </Typography>
        </Box>
        <Container maxWidth={false} sx={{ py: { xs: 1, xl: 2 } }}>
          <Toolbar disableGutters>
            <Grid container alignItems="center">
              <Grid item xs={6}>
                <Button
                  onClick={handleClickListItem}
                  id="branches-button"
                  aria-haspopup="listbox"
                  aria-controls="branches-menu"
                  sx={{
                    color: 'text.primary',
                    '&:hover': { color: 'primary.main' },
                    borderRadius: 2,
                  }}
                >
                  {isConferences ? <HyperaudioConferences size="large" /> : <HyperaudioMain size="large" />}
                </Button>
              </Grid>
              <Grid item xs={6} container justifyContent="flex-end">
                <Button color="primary" href={config.newsletter} variant="contained">
                  Stay informed
                </Button>
              </Grid>
            </Grid>
          </Toolbar>
        </Container>
        <Menu
          id="branches-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'branches-button',
            role: 'listbox',
            // dense: true,
          }}
        >
          <MenuItem
            component={Link}
            href="/"
            onClick={() => setAnchorEl(null)}
            selected={pathname === '/'}
            sx={{ display: 'flex', justifyContent: 'space-between', minWidth: '300px' }}
          >
            <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 500 }}>
              Hyperaudio
            </Typography>
          </MenuItem>
          <Divider />
          <MenuItem
            component={Link}
            href="/conferences"
            onClick={() => setAnchorEl(null)}
            divider
            selected={pathname === '/conferences'}
            sx={{ display: 'flex', justifyContent: 'space-between', minWidth: '300px' }}
          >
            <Typography variant="body2" color="primary" sx={{ fontWeight: 500 }}>
              Conferences
            </Typography>
          </MenuItem>
          <MenuItem
            onClick={() => setAnchorEl(null)}
            disabled
            divider
            selected={pathname === '/podcasts'}
            sx={{ display: 'flex', justifyContent: 'space-between', minWidth: '300px' }}
          >
            <Typography variant="body2" color="primary" sx={{ fontWeight: 500 }}>
              Podcasts
            </Typography>
            <Typography variant="overline" color="info">
              Coming soon
            </Typography>
          </MenuItem>
          <MenuItem
            onClick={() => setAnchorEl(null)}
            disabled
            selected={pathname === '/schools'}
            sx={{ display: 'flex', justifyContent: 'space-between', minWidth: '300px' }}
          >
            <Typography variant="body2" color="primary" sx={{ fontWeight: 500 }}>
              Schools
            </Typography>
            <Typography variant="overline" color="info">
              Coming soon
            </Typography>
          </MenuItem>
        </Menu>
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
