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
  color: isActive ? theme.palette.secondary.dark : theme.palette.primary.light,
  borderRadius: 0,
  borderRight: `1px solid ${theme.palette.divider}`,
  flexBasis: 'auto',
  flexGrow: 1,
  flexShrink: 0,
  justifyContent: isSingle ? 'center' : 'space-between',
  minHeight: theme.spacing(5),
  textTransform: 'none',
  [`&:hover`]: {
    background: isActive ? theme.palette.background.paper : 'transparent',
    color: theme.palette.secondary.dark,
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
  const { editable, sources, source, onSourceChange } = props;

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const onTranscriptsOpen = e => setAnchorEl(e.currentTarget);
  const onTranscriptsClose = () => setAnchorEl(null);

  console.log(sources);

  return (
    <>
      <Root className="topbar" disableGutters>
        {editable && (
          <div className="topbarSide topbarSide--left">
            <Tooltip title="Add source transcript…">
              <IconButton size="small">
                <AddCircleOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </div>
        )}
        <div className="topbarCore">
          <Tabs className="SourceTopbar">
            {sources.map(o => (
              <Tab
                color="inherit"
                component="a"
                isActive={o.data.id === source.data.id}
                isSingle={sources.length < 2}
                key={o.data.id}
                onClick={() => onSourceChange(o.data.id)}
                size="small"
                variant="contained"
                endIcon={
                  editable && (
                    <span>
                      <Tooltip title="Close">
                        <TabClose edge="end" size="small">
                          <CloseIcon sx={{ fontSize: '16px' }} />
                        </TabClose>
                      </Tooltip>
                    </span>
                  )
                }
              >
                <Typography noWrap sx={{ maxWidth: '150px' }} variant="caption">
                  {o.data.title}
                </Typography>
              </Tab>
            ))}
          </Tabs>
        </div>
        <div className="topbarSide topbarSide--right">
          <Tooltip title="All source transcripts…">
            <span>
              <IconButton size="small" onClick={onTranscriptsOpen} disabled={sources.length < 2}>
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
            {sources.map((o, i) => (
              <MenuItem
                key={o.data.id}
                onClick={() => onSourceChange(o.data.id)}
                selected={o.data.id === source.data.id}
              >
                <ListItemText>{o.data.title}</ListItemText>
                <span>
                  {editable && (
                    <Tooltip title="Close" enterDelay={1000}>
                      <IconButton size="small" edge="end" color="default" sx={{ ml: 3 }}>
                        <CloseIcon sx={{ fontSize: '16px' }} />
                      </IconButton>
                    </Tooltip>
                  )}
                </span>
              </MenuItem>
            ))}
            <Divider />
            <MenuItem>
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
