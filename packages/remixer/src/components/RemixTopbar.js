import React, { useState } from 'react';

import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ChromeReaderModeIcon from '@mui/icons-material/ChromeReaderMode';
import ChromeReaderModeOutlinedIcon from '@mui/icons-material/ChromeReaderModeOutlined';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Container from '@mui/material/Container';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Grow from '@mui/material/Grow';
import IconButton from '@mui/material/IconButton';
import IosShareIcon from '@mui/icons-material/IosShare';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LockIcon from '@mui/icons-material/Lock';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import PublicIcon from '@mui/icons-material/Public';
import RedoIcon from '@mui/icons-material/Redo';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import UndoIcon from '@mui/icons-material/Undo';
import { styled } from '@mui/material/styles';

import { ClearDialog, ShareDialog, VisibilityDialog } from '../dialogs';
import { RecursiveMenuItem, ShareIcon } from '@hyperaudio/common';

const PREFIX = 'RemixTopbar';
const classes = {
  core: `${PREFIX}-core`,
  side: `${PREFIX}-side`,
  sideL: `${PREFIX}-sideL`,
  sideR: `${PREFIX}-sideR`,
  title: `${PREFIX}-title`,
  titleField: `${PREFIX}-titleField`,
};

const Root = styled(Toolbar, {
  // shouldForwardProp: prop => !['maxWidth'].includes(prop),
})(({ theme }) => {
  return {
    borderLeft: `1px solid rgba(255,255,255,0.22)`,
    alignItems: 'center',
    display: 'flex',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    [theme.breakpoints.up('sm')]: {
      paddingTop: theme.spacing(1),
    },
    [theme.breakpoints.up('xl')]: {
      paddingTop: theme.spacing(2),
    },
    [`& .${classes.sideL}`]: {
      [`& > *`]: {
        marginRight: theme.spacing(1),
      },
    },
    [`& .${classes.sideR}`]: {
      [`& > *`]: {
        marginLeft: theme.spacing(1),
      },
    },
    [`& .${classes.titleField}`]: {
      ...theme.typography.body1,
      fontWeight: '500',
      padding: theme.spacing(1, 1),
      textAlign: 'center',
    },
  };
});

export const RemixTopbar = props => {
  const { editable, showSource, setShowSource, remix, hideToggleSource } = props;

  const [anchorEl, setAnchorEl] = useState(null);
  const [shareDialog, setShareDialog] = React.useState(false);
  const [titleFocus, setTitleFocus] = React.useState(false);
  const [visibilityDialog, setVisibilityDialog] = React.useState(false);
  const [clearDialog, setClearDialog] = React.useState(false);

  const open = Boolean(anchorEl);
  const onClearClose = () => setClearDialog(false);
  const onClearOpen = () => setClearDialog(true);
  const onMoreClose = () => setAnchorEl(null);
  const onMoreOpen = e => setAnchorEl(e.currentTarget);
  const onShareClose = () => setShareDialog(false);
  const onShareOpen = () => setShareDialog(true);
  const onVisibilityClose = () => setVisibilityDialog(false);
  const onVisibilityOpen = () => setVisibilityDialog(true);
  const onToggleSource = () => {
    setShowSource(prevState => !prevState);
    document.activeElement.blur();
  };

  const onTitleFocus = e => {
    setTitleFocus(true);
  };
  const onTitleBlur = e => {
    setTitleFocus(false);
    console.log(e.target.value);
  };

  return (
    <>
      <Root maxWidth={false}>
        <Grid container alignItems="center">
          <Grid item className={`${classes.side} ${classes.sideL}`}>
            {!editable && !hideToggleSource && (
              <Tooltip title={`Toggle source panel`}>
                <IconButton color="inherit" onClick={onToggleSource}>
                  {!showSource ? (
                    <ChromeReaderModeOutlinedIcon fontSize="small" />
                  ) : (
                    <ChromeReaderModeIcon fontSize="small" />
                  )}
                </IconButton>
              </Tooltip>
            )}
            {editable && (
              <>
                <Tooltip title="Undo">
                  <IconButton color="inherit" size="small">
                    <UndoIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Redo">
                  <IconButton color="inherit" size="small">
                    <RedoIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </>
            )}
          </Grid>
          <Grid item xs>
            <Container maxWidth="sm" sx={{ display: { xs: showSource ? 'none' : 'block', md: 'block' } }}>
              <TextField
                fullWidth
                placeholder="Give your remix a title…"
                required
                disabled={!editable}
                type="text"
                value={remix.title}
                InputProps={{
                  className: classes.title,
                  readOnly: !editable,
                }}
                inputProps={{
                  className: classes.titleField,
                  minLength: 1,
                  onBlur: onTitleBlur,
                  onFocus: onTitleFocus,
                }}
                variant="filled"
                size="small"
              />
            </Container>
          </Grid>
          <Grid item className={`${classes.side} ${classes.sideR}`}>
            {editable && (
              <>
                <Tooltip title="More remix options…">
                  <IconButton color="inherit" size="small" onClick={onMoreOpen}>
                    <MoreHorizIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Popper
                  anchorEl={anchorEl}
                  onClick={onMoreClose}
                  onClose={onMoreClose}
                  open={open}
                  placement="bottom-end"
                >
                  <Grow in={open} appear={open}>
                    <Paper elevation={12}>
                      <ClickAwayListener onClickAway={onMoreClose}>
                        <MenuList dense={true}>
                          <RecursiveMenuItem
                            autoFocus={false}
                            label={
                              <>
                                <ListItemIcon>
                                  <IosShareIcon fontSize="small" color="primary" />
                                </ListItemIcon>
                                <ListItemText primary="Export" primaryTypographyProps={{ color: 'primary' }} />
                                <ArrowRightIcon fontSize="small" />
                              </>
                            }
                            placement="left-start"
                            elevation={0}
                            MenuListProps={{ dense: true }}
                          >
                            <MenuItem onClick={() => console.log('Text')}>
                              <ListItemText primary="Text" primaryTypographyProps={{ color: 'primary' }} />
                            </MenuItem>
                            <MenuItem onClick={() => console.log('JSON')}>
                              <ListItemText primary="JSON" primaryTypographyProps={{ color: 'primary' }} />
                            </MenuItem>
                            <MenuItem onClick={() => console.log('WP Plugin-compatible HTML')}>
                              <ListItemText
                                primary="WP Plugin-compatible HTML"
                                primaryTypographyProps={{ color: 'primary' }}
                              />
                            </MenuItem>
                            <MenuItem onClick={() => console.log('Interactive transcript')}>
                              <ListItemText
                                primary="Interactive Transcript"
                                primaryTypographyProps={{ color: 'primary' }}
                              />
                            </MenuItem>
                          </RecursiveMenuItem>
                          <MenuItem onClick={() => setVisibilityDialog(true)}>
                            <ListItemIcon>
                              {remix.secret ? (
                                <PublicIcon fontSize="small" color="primary" />
                              ) : (
                                <LockIcon fontSize="small" color="primary" />
                              )}
                            </ListItemIcon>
                            <ListItemText
                              primary={`Make ${remix.secret ? 'public' : 'private'}`}
                              primaryTypographyProps={{ color: 'primary' }}
                            />
                          </MenuItem>
                          <Divider />
                          <MenuItem onClick={() => setClearDialog(true)}>
                            <ListItemIcon>
                              <DeleteSweepIcon fontSize="small" color="error" />
                            </ListItemIcon>
                            <ListItemText primary="Clear" primaryTypographyProps={{ color: 'error' }} />
                          </MenuItem>
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                </Popper>
              </>
            )}
            <Tooltip title="Share remix">
              <IconButton color="inherit" onClick={onShareOpen} size="small">
                <ShareIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </Root>
      <ShareDialog isOpen={shareDialog} onClose={onShareClose} />
      <VisibilityDialog isOpen={visibilityDialog} onClose={onVisibilityClose} secret={remix.secret} />
      <ClearDialog isOpen={clearDialog} onClose={onClearClose} />
    </>
  );
};
