import React from 'react';

import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

export const ClearDialog = props => {
  const { isOpen, onClose } = props;

  return (
    <Dialog fullWidth maxWidth="xs" open={isOpen} onClose={onClose}>
      <DialogTitle>
        Clear remix?
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
        <Typography variant="body1">All sections within this remix will be removed.</Typography>
      </DialogContent>
      <DialogActions>
        <Grid container spacing={2}>
          <Grid item xs>
            <Button onClick={onClose}>Cancel</Button>
          </Grid>
          <Grid item>
            <Button onClick={onClose} variant="contained" color="primary">
              Clear remix
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
  );
};
