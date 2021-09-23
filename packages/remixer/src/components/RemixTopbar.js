import React from 'react';
import { useRef, useState } from 'react';

import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import Divider from '@mui/material/Divider';
import DownloadIcon from '@mui/icons-material/Download';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LockIcon from '@mui/icons-material/Lock';
import Menu from '@mui/material/Menu';
import MenuItem, { MenuItemProps } from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Paper from '@mui/material/Paper';
import Popper, { PopperProps } from '@mui/material/Popper';
import RedoIcon from '@mui/icons-material/Redo';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import UndoIcon from '@mui/icons-material/Undo';
// import { createStyles, makeStyles } from '@mui/material';

// const useStyles = makeStyles(theme =>
//   createStyles({
//     active: {
//       backgroundColor: 'rgba(0, 0, 0, 0.04)',
//     },
//   }),
// );

type RecursiveMenuItemProps = MenuItemProps & {
  button?: true,
  label: string,
} & Pick<PopperProps, 'placement'>;
const RecursiveMenuItem = (props: RecursiveMenuItemProps) => {
  // const classes = useStyles();
  const [open, setOpen] = useState(false);
  // const ref = (useRef < HTMLLIElement) | (null > null);
  const ref = useRef();

  return (
    <MenuItem
      {...props}
      ref={ref}
      MenuListProps={{
        dense: true,
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      // className={open ? classes.active : ''}
      onMouseEnter={() => setOpen(true)}
      // onFocus={() => setOpen(true)}
      // onBlur={() => setOpen(false)}
      onMouseLeave={() => setOpen(false)}
    >
      {props.label}
      <Popper
        anchorEl={ref.current}
        open={open}
        placement={props.placement ?? 'right'}
        modifiers={{
          flip: {
            enabled: true,
          },
          preventOverflow: {
            enabled: true,
            boundariesElement: 'viewport',
          },
        }}
      >
        <Paper>{props.children}</Paper>
      </Popper>
    </MenuItem>
  );
};

import { HideSourceIcon, ShareIcon, ShowSourceIcon } from '../icons';
import { ClickAwayListener } from '@material-ui/core';

export const RemixTopbar = props => {
  const { editable, showSource, setShowSource } = props;

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const onMoreOpen = e => setAnchorEl(e.currentTarget);
  const onMoreClose = () => setAnchorEl(null);

  return (
    <>
      <Toolbar className="topbar">
        <div className="topbarSide topbarSide--left">
          {!editable && (
            <Tooltip title={`${!showSource ? 'Show' : 'Hide'} source panel`}>
              <IconButton onClick={() => setShowSource(prevState => !prevState)}>
                {!showSource ? <ShowSourceIcon fontSize="small" /> : <HideSourceIcon fontSize="small" />}
              </IconButton>
            </Tooltip>
          )}
          {editable && (
            <>
              <Tooltip title="Undo">
                <IconButton size="small">
                  <UndoIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Undo">
                <IconButton size="small">
                  <RedoIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </>
          )}
        </div>
        <div className="topbarCore">Title</div>
        <div className="topbarSide topbarSide--right">
          {editable && (
            <>
              <Tooltip title="More remix options…">
                <IconButton size="small" onClick={onMoreOpen}>
                  <MoreHorizIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              {/* <ClickAwayListener onClickAway={onMoreClose}> */}
              <Popper
                anchorEl={anchorEl}
                placement="bottom-end"
                disablePortal={false}
                open={open}
                onClose={onMoreClose}
                onClick={onMoreClose}
                // transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                // anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5,
                    '&:before': {
                      bgcolor: 'background.paper',
                      content: '""',
                      display: 'block',
                      height: 10,
                      position: 'absolute',
                      right: 14,
                      top: 0,
                      transform: 'translateY(-50%) rotate(45deg)',
                      width: 10,
                      zIndex: 0,
                    },
                  }}
                >
                  <MenuList dense={true} /*autoFocus={true}*/>
                    <RecursiveMenuItem
                      autoFocus={false}
                      label={
                        <>
                          <ListItemIcon>
                            <DownloadIcon fontSize="small" color="primary" />
                          </ListItemIcon>
                          <ListItemText primary="Export" primaryTypographyProps={{ color: 'primary' }} />
                        </>
                      }
                    >
                      <MenuItem>
                        <ListItemIcon>
                          <LockIcon fontSize="small" color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Interactive Transcript" primaryTypographyProps={{ color: 'primary' }} />
                      </MenuItem>
                    </RecursiveMenuItem>
                    <MenuItem>
                      <ListItemIcon>
                        <LockIcon fontSize="small" color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="Make private" primaryTypographyProps={{ color: 'primary' }} />
                    </MenuItem>
                    <Divider />
                    <MenuItem>
                      <ListItemIcon>
                        <DeleteSweepIcon fontSize="small" color="error" />
                      </ListItemIcon>
                      <ListItemText primary="Clear" primaryTypographyProps={{ color: 'error' }} />
                    </MenuItem>
                  </MenuList>
                </Paper>
              </Popper>
              {/* </ClickAwayListener> */}
              {/* <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={onMoreClose}
                onClick={onMoreClose}
                MenuListProps={{
                  dense: true,
                }}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5,
                    '&:before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: 'background.paper',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                  },
                }}
                variant="selectedMenu"
              ></Menu> */}
            </>
          )}
          <Tooltip title="Share remix">
            <IconButton size="small">
              <ShareIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>
      </Toolbar>
      <div className="topbarPush" />
    </>
  );
};
