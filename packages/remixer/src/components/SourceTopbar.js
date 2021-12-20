import React from 'react';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

const Root = styled(Toolbar)(({ theme }) => ({
  alignItems: 'stretch !important',
  backgroundColor: theme.palette.background.default,
  [`.topbarCore`]: {
    overflowX: 'auto !important',
    overflow: 'visible',
  },
}));

const Tabs = styled('div')(({ theme }) => ({
  alignItems: 'center',
  display: 'flex',
  flexFlow: 'row',
  justifyContent: 'flex-start',
  maxWidth: 'inherit',
  whiteSpace: 'inherit',
}));

const Tab = styled(Button, {
  shouldForwardProp: prop => prop !== 'isActive' && prop !== 'isSingle',
})(({ theme, isActive, isSingle }) => ({
  background: isActive ? theme.palette.background.paper : 'transparent',
  borderRadius: 0,
  color: isActive ? theme.palette.primary.dark : theme.palette.primary.light,
  flexBasis: 'auto',
  flexGrow: 1,
  flexShrink: 0,
  justifyContent: isSingle ? 'center' : 'space-between',
  minHeight: theme.spacing(5),
  textTransform: 'none',
  [`&:not(:last-child)`]: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  [`&:hover`]: {
    background: isActive ? theme.palette.background.paper : 'transparent',
    color: theme.palette.primary.dark,
  },
  [`& .MuiButton-endIcon > span`]: {
    lineHeight: 0,
  },
}));

const TabClose = styled(IconButton, {
  shouldForwardProp: prop => prop !== 'isActive',
})(({ theme, isActive }) => ({
  background: theme.palette.background.default,
  [`&, & *`]: {
    color: isActive ? theme.palette.primary.dark : theme.palette.primary.light,
  },
}));

export const SourceTopbar = props => {
  const { editable, media, tabs, source, onSourceChange, onSourceClose, onShowLibrary } = props;

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const onTranscriptsOpen = e => setAnchorEl(e.currentTarget);
  const onTranscriptsClose = () => setAnchorEl(null);

  const onTabClose = (e, id) => {
    e.stopPropagation();
    setAnchorEl(null);
    onSourceClose(id);
  };

  // console.group(SourceTopbar);
  // console.log(sources);
  // console.groupEnd();

  return (
    <>
      <Root className="topbar" disableGutters>
        {editable && (
          <div className="topbarSide topbarSide--left">
            <Tooltip title="Add source transcript…">
              <IconButton onClick={onShowLibrary} size="small" disabled={media?.length === 0}>
                <AddCircleOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </div>
        )}
        <div className="topbarCore">
          <Tabs className="SourceTopbar">
            {tabs.map(o => (
              <Tab
                color="inherit"
                component="a"
                endIcon={
                  editable && (
                    <span>
                      {tabs.length > 1 && (
                        <Tooltip title="Close">
                          <TabClose edge="end" size="small" onClick={e => onTabClose(e, o.id)}>
                            <CloseIcon sx={{ fontSize: '16px' }} />
                          </TabClose>
                        </Tooltip>
                      )}
                    </span>
                  )
                }
                isActive={o.id === source?.id}
                isSingle={tabs.length < 2}
                key={o.id}
                onClick={() => onSourceChange(o.id)}
                size="small"
                variant="contained"
              >
                <Typography noWrap sx={{ maxWidth: '150px' }} variant="caption" title={o.title}>
                  {o.title}
                </Typography>
              </Tab>
            ))}
          </Tabs>
        </div>
        <div className="topbarSide topbarSide--right">
          <Tooltip title="All source transcripts…">
            <span>
              <IconButton size="small" onClick={onTranscriptsOpen} disabled={tabs.length < 2}>
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={onTranscriptsClose}
            onClick={onTranscriptsClose}
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
            {tabs.map((o, i) => (
              <MenuItem key={o.id} onClick={() => onSourceChange(o.id)} selected={o.id === source.id}>
                <ListItemText
                  primaryTypographyProps={{ noWrap: true, variant: 'body2' }}
                  sx={{ maxWidth: '200px' }}
                  title={o.title}
                >
                  {o.title}
                </ListItemText>
                <span>
                  {editable && (
                    <Tooltip enterDelay={1500} title="Close">
                      <IconButton
                        color="default"
                        edge="end"
                        onClick={e => onTabClose(e, o.id)}
                        size="small"
                        sx={{ ml: 3 }}
                      >
                        <CloseIcon sx={{ fontSize: '16px' }} />
                      </IconButton>
                    </Tooltip>
                  )}
                </span>
              </MenuItem>
            ))}
            <Divider />
            <MenuItem disabled={media?.length === 0} onClick={onShowLibrary}>
              <ListItemIcon>
                <AddCircleOutlineIcon color="primary" fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Add source transcript…" primaryTypographyProps={{ color: 'primary' }} />
            </MenuItem>
          </Menu>
        </div>
      </Root>
      <div className="topbarPush" />
    </>
  );
};
