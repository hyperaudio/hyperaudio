import React from 'react';

import Button from '@mui/material/Button';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FacebookIcon from '@mui/icons-material/Facebook';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import Tooltip from '@mui/material/Tooltip';
import TwitterIcon from '@mui/icons-material/Twitter';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

import { Share1Pane, Share2Panes } from '@hyperaudio/common';

const PREFIX = 'ShareDialog';
const classes = {
  root: `${PREFIX}`,
  toggleButton: `${PREFIX}-toggleButton`,
  field: `${PREFIX}-field`,
  copiedButton: `${PREFIX}-copiedButton`,
};
const Root = styled(Dialog)(({ theme }) => ({
  [`& .${classes.toggleButton}`]: {
    marginBottom: theme.spacing(1),
    minHeight: '100px',
  },
  [`& .${classes.field}`]: {
    marginTop: theme.spacing(3),
  },
  [`& .${classes.copiedButton}`]: {
    background: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
}));

export const ShareDialog = props => {
  const { isOpen, onClose } = props;
  const inputRef = React.useRef();

  const [isCopied, setIsCopied] = React.useState(false);
  const [includeSource, setIncludeSource] = React.useState(false);

  // This is the function we wrote earlier
  async function copyToClipboard(text) {
    if ('clipboard' in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand('copy', true, text);
    }
  }

  const handleCopyClick = () => {
    inputRef.current.focus();
    copyToClipboard(inputRef.current.value)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 1500);
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <Root fullWidth maxWidth="xs" open={isOpen} onClose={onClose}>
      <DialogTitle>
        Share Remix{' '}
        <IconButton
          aria-label="close"
          onClick={onClose}
          size="small"
          sx={{
            color: theme => theme.palette.grey[500],
            position: 'absolute',
            right: theme => theme.spacing(1),
            top: theme => theme.spacing(1),
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <ToggleButton
              aria-label="Include source"
              className={classes.toggleButton}
              color="primary"
              fullWidth
              onClick={() => setIncludeSource(false)}
              selected={!includeSource}
              size="large"
              value="excludesource"
            >
              <Share1Pane sx={{ fontSize: 40 }} />
            </ToggleButton>
            <Typography
              color={!includeSource ? 'primary' : 'textSecondary'}
              align="center"
              variant="caption"
              component="h3"
            >
              Remix only
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <ToggleButton
              aria-label="Include source"
              className={classes.toggleButton}
              color="primary"
              fullWidth
              onClick={() => setIncludeSource(true)}
              selected={includeSource}
              size="large"
              value="includesource"
              disabled={true}
            >
              <Share2Panes sx={{ fontSize: 40 }} />
            </ToggleButton>
            <Typography
              color={includeSource ? 'primary' : 'textSecondary'}
              align="center"
              variant="caption"
              component="h3"
            >
              Remix & Source
            </Typography>
          </Grid>
        </Grid>
        <TextField
          autoFocus
          size="small"
          fullWidth
          label="Grab you share link:"
          // disabled
          className={classes.field}
          type="url"
          inputRef={inputRef}
          inputProps={{
            onFocus: e => e.target.select(),
            readOnly: true,
          }}
          value={document.location.href}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title="Copy to clipboard">
                  <IconButton
                    className={isCopied ? classes.copiedButton : ''}
                    color={isCopied ? 'primary' : 'default'}
                    onClick={handleCopyClick}
                    size="small"
                  >
                    {isCopied ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ),
          }}
        />
      </DialogContent>
      <DialogActions>
        <Grid container spacing={2}>
          <Grid item xs>
            <Tooltip title="Share on Facebook">
              <IconButton onClick={() => console.log('Share on Facebook')} disabled={true}>
                <FacebookIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Share on Twitter">
              <IconButton onClick={() => console.log('Share on Twitter')} disabled={true}>
                <TwitterIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Share via Email">
              <IconButton onClick={() => console.log('Share via Email')} disabled={true}>
                <MailOutlineIcon />
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid item>
            <Button onClick={onClose} variant="contained" color="primary">
              Done
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Root>
  );
};
