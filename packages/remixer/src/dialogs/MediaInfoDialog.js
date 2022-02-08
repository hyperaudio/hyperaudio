import React from 'react';
import Draggable from 'react-draggable';

import Chip from '@mui/material/Chip';
import CloseIcon from '@mui/icons-material/Close';
import Fade from '@mui/material/Fade';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Portal from '@mui/material/Portal';
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
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'stretch',
    maxHeight: '360px',
    maxWidth: '320px',
    overflow: 'hidden',
    position: 'fixed',
    right: theme.spacing(4),
    top: '33%',
    userSelect: 'none',
    width: '100%',
    zIndex: theme.zIndex.modal,
    [`& .${classes.head}`]: {
      background: theme.palette.background.default,
      borderBottom: `1px solid ${theme.palette.divider}`,
      color: theme.palette.primary.dark,
      cursor: 'move',
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
    },
    [`& .${classes.ul}`]: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
    },
    [`& .${classes.li}`]: {
      display: 'inline-block',
      marginRight: theme.spacing(1),
      [`&:not(:last-child):after`]: {
        content: '","',
        display: 'inline',
      },
    },
  };
});

export const MediaInfoDialog = props => {
  const container = React.useRef(null);
  const { open, onClose, source } = props;

  // console.group('MediaInfo');
  // console.log({ props });
  // console.groupEnd();

  return (
    <Portal container={container.current}>
      <Draggable handle="#media-detail-dialog" bounds="body">
        <Fade in={open}>
          <Root elevation={2} className={classes.root} aria-labelledby="media-detail-dialog">
            <Typography className={classes.head} id="media-detail-dialog" variant="subtitle1">
              Media details
              <IconButton
                aria-label="close"
                size="small"
                onClick={onClose}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  color: theme => theme.palette.grey[500],
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Typography>
            <div className={classes.body}>
              <Typography gutterBottom id="title-label" variant="subtitle2">
                Title
              </Typography>
              <div>
                <TextField
                  aria-labelledby="title-label"
                  disabled
                  fullWidth
                  id="title"
                  placeholder="Give your media a title…"
                  required
                  size="small"
                  value={source.title}
                  inputProps={{
                    className: classes.field,
                  }}
                />
              </div>
              <br />
              <Typography gutterBottom variant="subtitle2" id="channel-label">
                Channel
              </Typography>
              <div>
                <TextField
                  aria-labelledby="channel-label"
                  disabled
                  fullWidth
                  id="channel"
                  placeholder="Give your remix a title…"
                  select
                  size="small"
                  value={source.channel.id}
                  inputProps={{
                    className: classes.field,
                  }}
                >
                  {[source.channel].map(channel => {
                    return (
                      <MenuItem dense key={channel.id} value={channel.id}>
                        {channel.name}
                      </MenuItem>
                    );
                  })}
                </TextField>
              </div>
              <br />
              <Typography gutterBottom variant="subtitle2">
                Tags
              </Typography>
              <div>
                {source.tags.length > 0
                  ? source.tags.map(t => <Chip label={t} size="small" key={t} sx={{ mr: 0.5 }} />)
                  : '—'}
              </div>
              <br />
              <Typography variant="subtitle2">Linked remixes</Typography>
              {source.remixes.length > 0 ? (
                <ul className={classes.ul}>
                  {source.remixes.map(r => (
                    <li className={classes.li} key={r.id}>
                      <Link variant="body2" sx={{ cursor: 'pointer' }}>
                        {r.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                '—'
              )}
            </div>
          </Root>
        </Fade>
      </Draggable>
    </Portal>
  );
};
