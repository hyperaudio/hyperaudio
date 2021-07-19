/* eslint-disable no-unused-vars */
import React from 'react';
import NextLink from 'next/link';

import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import HomeIcon from '@material-ui/icons/Home';
import Slide from '@material-ui/core/Slide';
import makeStyles from '@material-ui/core/styles/makeStyles';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import ButtonBase from '@material-ui/core/ButtonBase';
import FeaturedPlayListIcon from '@material-ui/icons/FeaturedPlayList';
import ShuffleIcon from '@material-ui/icons/Shuffle';

import VideoLibraryIcon from '@material-ui/icons/VideoLibrary';

const useStyles = makeStyles(theme => ({
  push: {
    ...theme.mixins.toolbar,
  },
  root: {
    background: theme.palette.background.default,
    bottom: 0,
    boxShadow: theme.shadows[3],
    height: 'auto',
    left: 0,
    margin: 0,
    position: 'fixed',
    right: 0,
    top: 'auto',
    zIndex: theme.zIndex.appBar,
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  action: {
    color: theme.palette.primary.main,
  },
  selectedAction: {
    background: theme.palette.background.paper,
    '& > *': {
      color: theme.palette.text.primary,
    },
  },
}));

export default function Navbar({ pathname, ...props }) {
  const classes = useStyles();
  const trigger = useScrollTrigger();

  return (
    <>
      <div className={classes.push} />
      <Slide appear={false} direction="up" in={!trigger}>
        <BottomNavigation className={classes.root} component="nav" showLabels value={pathname}>
          <BottomNavigationAction
            classes={{
              root: classes.action,
              selected: classes.selectedAction,
            }}
            component={options => (
              <NextLink href={options.to} passHref>
                <ButtonBase {...options} />
              </NextLink>
            )}
            icon={<HomeIcon fontSize="small" />}
            label="Home"
            to="/"
            value="/"
          />
          <BottomNavigationAction
            classes={{
              root: classes.action,
              selected: classes.selectedAction,
            }}
            component={options => (
              <NextLink href={options.to} passHref>
                <ButtonBase {...options} />
              </NextLink>
            )}
            icon={<FeaturedPlayListIcon fontSize="small" />}
            label="Channels"
            to="/channels"
            value="/channels"
          />
          <BottomNavigationAction
            classes={{
              root: classes.action,
              selected: classes.selectedAction,
            }}
            component={options => (
              <NextLink href={options.to} passHref>
                <ButtonBase {...options} />
              </NextLink>
            )}
            icon={<VideoLibraryIcon fontSize="small" />}
            label="Media"
            to="/media"
            value="/media"
          />
          <BottomNavigationAction
            classes={{
              root: classes.action,
              selected: classes.selectedAction,
            }}
            component={options => (
              <NextLink href={options.to} passHref>
                <ButtonBase {...options} />
              </NextLink>
            )}
            icon={<ShuffleIcon fontSize="small" />}
            label="Mixes"
            to="/mixes"
            value="/mixes"
          />
        </BottomNavigation>
      </Slide>
    </>
  );
}
