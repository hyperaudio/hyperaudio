import React from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FacebookIcon from '@mui/icons-material/Facebook';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Tooltip from '@mui/material/Tooltip';
import TwitterIcon from '@mui/icons-material/Twitter';

import { Share1Pane, Share2Panes } from '../icons';

export const ShareDialog = props => {
  const { isOpen, onClose } = props;

  const [maxWidth, setMaxWidth] = React.useState('sm');

  const handleMaxWidthChange = event => {
    setMaxWidth(
      // @ts-expect-error autofill of arbitrary value is not handled.
      event.target.value,
    );
  };

  return (
    <Dialog fullWidth maxWidth="xs" open={isOpen} onClose={onClose}>
      <DialogTitle>Share Remix</DialogTitle>
      <DialogContent>
        {/* <DialogContentText>You can set my maximum width and whether to adapt or not.</DialogContentText> */}
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Card variant="outlined">
              <CardMedia>
                <Share1Pane sx={{ fontSize: 40 }} />
              </CardMedia>
              <CardContent>Content</CardContent>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card variant="outlined">
              <CardMedia>
                <Share2Panes sx={{ fontSize: 40 }} />
              </CardMedia>
              <CardContent>Content</CardContent>
            </Card>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Grid container spacing={2}>
          <Grid item xs>
            <Tooltip title="Share on Facebook">
              <IconButton>
                <FacebookIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Share on Twitter">
              <IconButton>
                <TwitterIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Share via Email">
              <IconButton>
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
    </Dialog>
  );
};
