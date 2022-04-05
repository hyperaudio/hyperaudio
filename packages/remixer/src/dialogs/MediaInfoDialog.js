import React from 'react';
import Draggable from 'react-draggable';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import CloseIcon from '@mui/icons-material/Close';
import Fade from '@mui/material/Fade';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';

import { Typography } from '@mui/material';

const PREFIX = 'MediaInfoDialog';
const classes = {
  body: `${PREFIX}-body`,
  field: `${PREFIX}-field`,
  head: `${PREFIX}-head`,
  headPush: `${PREFIX}-headPush`,
  li: `${PREFIX}-li`,
  root: `${PREFIX}-root`,
  ul: `${PREFIX}-ul`,
};

const Root = styled(Paper, {
  // shouldForwardProp: prop => !['comapct'].includes(prop),
})(({ theme }) => {
  return {
    alignContent: 'flexStart',
    alignItems: 'flexStart',
    border: `3px solid ${theme.palette.primary.main}`,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'stretch',
    maxHeight: '400px',
    maxWidth: '320px',
    overflow: 'hidden',
    position: 'fixed',
    right: theme.spacing(4),
    top: '33%',
    userSelect: 'none',
    width: '100%',
    zIndex: 9999,
    [`& .${classes.head}`]: {
      alignItems: 'center',
      background: theme.palette.primary.main,
      borderBottom: `1px solid ${theme.palette.divider}`,
      color: theme.palette.primary.contrastText,
      cursor: 'move',
      display: 'flex',
      fontWeight: '500',
      padding: theme.spacing(1, 2),
    },
    [`& .${classes.body}`]: {
      padding: theme.spacing(2, 2),
      flex: '1 1 auto',
      overflow: 'auto',
    },
    [`& .${classes.field}`]: {
      ...theme.typography.body2,
      padding: theme.spacing(1),
    },
  };
});

export const MediaInfoDialog = props => {
  const { open, onClose, source } = props;

  // console.log({ source });

  return (
    <Draggable handle="#media-detail-dialog" bounds="#Remixer-root">
      <Fade in={open}>
        <Root
          BackdropComponent={null}
          aria-labelledby="media-detail-dialog"
          disablePortal
          open={true}
          elevation={2}
          className={classes.root}
          sx={{ display: open ? 'block' : 'none' }}
        >
          <Box className={classes.head}>
            <Typography id="media-detail-dialog" sx={{ flexGrow: 1, fontWeight: 500 }} variant="body2">
              Media details
            </Typography>
            <IconButton edge="end" aria-label="close" size="small" onClick={onClose} color="inherit">
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
          <Box className={classes.body}>
            <Box>
              <Typography display="block" gutterBottom variant="overline" color="textSecondary">
                Title
              </Typography>
              <TextField
                aria-labelledby="title-label"
                disabled
                fullWidth
                id="title"
                placeholder="Give your media a title…"
                required
                size="small"
                value={source.title}
                variant="filled"
                inputProps={{
                  className: classes.field,
                }}
              />
            </Box>
            <Box sx={{ mt: 3 }}>
              <Typography display="block" gutterBottom variant="overline" color="textSecondary">
                Channel
              </Typography>
              <TextField
                aria-labelledby="channel-label"
                disabled
                fullWidth
                id="channel"
                placeholder="Give your remix a title…"
                select
                size="small"
                value={source.channel.id}
                variant="filled"
                inputProps={{
                  className: classes.field,
                }}
              >
                {[source.channel].map(channel => (
                  <MenuItem dense key={channel.id} value={channel.id}>
                    {channel.name}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Box sx={{ mt: 3 }}>
              <Typography display="block" gutterBottom variant="overline" color="textSecondary">
                Tags
              </Typography>
              {source.tags.length > 0 ? (
                <Stack direction="row" spacing={1}>
                  {source.tags.map(t => (
                    <Chip key={t} size="small" label={t} />
                  ))}
                </Stack>
              ) : (
                '—'
              )}
            </Box>
            <Box sx={{ mt: 3 }}>
              <Typography display="block" gutterBottom variant="overline" color="textSecondary">
                Linked remixes
              </Typography>
              {source.remixes.length > 0 ? (
                <List dense>
                  {source.remixes.map(r => (
                    <ListItem key={r.id} disableGutters>
                      <Link variant="caption">{r.title}</Link>
                    </ListItem>
                  ))}
                </List>
              ) : (
                '—'
              )}
            </Box>
          </Box>
        </Root>
      </Fade>
    </Draggable>
  );
};
