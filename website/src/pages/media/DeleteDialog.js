import React from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function DeleteDialog({ onConfirm, onCancel, open, transcript }) {
  return (
    <Dialog
      PaperProps={{ style: { width: '100%' } }}
      aria-labelledby="dialog-title"
      maxWidth="xs"
      onClose={onCancel}
      open={open}
    >
      <DialogTitle id="dialog-title">Delete transcript?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Selected transcript:{' '}
          <strong>
            {transcript?.title} ({transcript?.lang})
          </strong>{' '}
          will be deleted irreversibly.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="primary">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="primary" variant="contained">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
