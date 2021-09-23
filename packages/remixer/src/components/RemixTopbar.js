import React from 'react';

import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import Divider from '@mui/material/Divider';
import DownloadIcon from '@mui/icons-material/Download';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LockIcon from '@mui/icons-material/Lock';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import RedoIcon from '@mui/icons-material/Redo';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import UndoIcon from '@mui/icons-material/Undo';

import { HideSourceIcon, ShareIcon, ShowSourceIcon } from '../icons';

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

              <Menu
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
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem>
                  <ListItemIcon>
                    <DownloadIcon fontSize="small" color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Export" primaryTypographyProps={{ color: 'primary' }} />
                </MenuItem>
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
              </Menu>
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
