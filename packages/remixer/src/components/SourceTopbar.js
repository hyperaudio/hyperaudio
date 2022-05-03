import React from 'react';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { ThemeProvider } from '@mui/material';
import { styled } from '@mui/material/styles';

import { getTheme } from '@hyperaudio/common';

const PREFIX = 'SourceTopbar';
const classes = {
  root: `${PREFIX}-root`,
};

const Root = styled(Box)(({ theme }) => ({
  // backgroundColor: theme.palette.background.default,
  alignItems: 'stretch !important',
  alignItems: 'stretch',
  borderBottom: `1px solid rgba(255,255,255,0.22)`,
  display: 'flex',
  minHeight: 'auto',
  position: 'absolute',
  width: '100%',
  [`& .topbarSide`]: {
    alignItems: 'center',
    display: 'flex',
    flexBasis: 'auto',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: theme.spacing(0, 0.5),
    [`&.topbarSide--left`]: {
      borderRight: `1px solid rgba(255,255,255,0.22)`,
    },
    [`&.topbarSide--right`]: {
      borderLeft: `1px solid rgba(255,255,255,0.22)`,
      // marginLeft: `-1px`,
    },
  },
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
  background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
  borderRadius: 0,
  color: isActive ? 'white' : 'rgba(255,255,255,0.66)',
  flexBasis: 'auto',
  flexGrow: 1,
  flexShrink: 0,
  justifyContent: isSingle ? 'center' : 'space-between',
  minHeight: theme.spacing(5),
  textTransform: 'none',
  [`&:not(:last-child)`]: {
    borderRight: `1px solid rgba(255,255,255,0.22)`,
  },
  [`&:hover`]: {
    background: 'rgba(255,255,255,0.1)',
    color: 'white',
  },
  [`& .MuiButton-endIcon > span`]: {
    lineHeight: 0,
  },
}));

export default function SourceTopbar(props) {
  const { editable, media, sources, tabs, source, onSourceChange, onSourceClose, onShowLibrary } = props;

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
    <Root className={classes.root} disableGutters>
      {editable && (
        <div className="topbarSide topbarSide--left">
          <Tooltip title="Add source transcript…">
            <IconButton color="inherit" onClick={onShowLibrary} size="small" disabled={sources?.length < 2}>
              <AddCircleOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>
      )}
      <div className="topbarCore">
        <Tabs className="SourceTopbar">
          {tabs.map(o => (
            <Tab
              component="a"
              endIcon={
                editable && (
                  <span>
                    {tabs.length > 1 && (
                      <Tooltip title="Close">
                        <IconButton color="inherit" edge="end" size="small" onClick={e => onTabClose(e, o.id)}>
                          <CloseIcon sx={fontSize16px} />
                        </IconButton>
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
              sx={o.id === source?.id && tabs.length < 2 ? { background: 'transparent !important' } : {}}
            >
              <Typography
                color="inherit"
                noWrap
                sx={{ maxWidth: tabs.length < 2 ? 'auto' : '150px' }}
                title={o.title}
                variant="caption"
              >
                {o.title}
              </Typography>
            </Tab>
          ))}
        </Tabs>
      </div>
      <div className="topbarSide topbarSide--right">
        <Tooltip title="All sources">
          <span>
            <IconButton color="inherit" size="small" onClick={onTranscriptsOpen}>
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
            <MenuItem
              disabled={tabs.length === 1}
              key={o.id}
              onClick={() => onSourceChange(o.id)}
              selected={o.id === source.id}
            >
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
                      color="inherit"
                      edge="end"
                      onClick={e => onTabClose(e, o.id)}
                      size="small"
                      sx={{ ml: 3 }}
                    >
                      <CloseIcon sx={fontSize16px} />
                    </IconButton>
                  </Tooltip>
                )}
              </span>
            </MenuItem>
          ))}
          <Divider />
          <MenuItem disabled={media?.length === 0} onClick={onShowLibrary}>
            <ListItemText primary="Add source…" primaryTypographyProps={{ color: 'primary' }} />
          </MenuItem>
        </Menu>
      </div>
    </Root>
  );
}

const fontSize16px = { fontSize: '16px' };
