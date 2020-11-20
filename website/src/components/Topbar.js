import NextLink from 'next/link';

import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import SettingsIcon from '@material-ui/icons/Settings';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';

import HyperaudioIcon from 'src/assets/hyperaudio-icon.svg';

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  push: {
    ...theme.mixins.toolbar,
  },
}));

export default function Topbar() {
  const classes = useStyles();
  return (
    <>
      <AppBar>
        <Toolbar>
          <Typography variant="h4" component="h1">
            <NextLink href="/" passHref>
              <Link color="inherit">
                <HyperaudioIcon />
              </Link>
            </NextLink>
          </Typography>
          <div className={classes.grow} />
          <NextLink href="/" passHref>
            <Button color="inherit" variant="text">
              Home
            </Button>
          </NextLink>
          <NextLink href="/media" passHref>
            <Button color="inherit" variant="text">
              Media
            </Button>
          </NextLink>
          <NextLink href="/mixes" passHref>
            <Button color="inherit" variant="text">
              Mixes
            </Button>
          </NextLink>
          <div className={classes.grow} />
          <Tooltip title="More options…">
            <IconButton edge="end" color="inherit" variant="text">
              <SettingsIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <div className={classes.push} />
    </>
  );
}
