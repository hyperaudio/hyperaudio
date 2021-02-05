import React from 'react';

import Autocomplete from '@material-ui/lab/Autocomplete';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

export default function EditorsDialog({ users = [], data: { editors }, onConfirm, onCancel, open = false }) {
  React.useEffect(() => {
    console.log('do somehting');
  }, [editors]);

  console.log({ users, editors });

  return (
    <Dialog
      PaperProps={{ style: { width: '100%' } }}
      aria-labelledby="dialog-title"
      maxWidth="xs"
      onClose={onCancel}
      open={open}
    >
      <DialogTitle id="dialog-title">Manage editors</DialogTitle>
      <form>
        <DialogContent>{editors?.length > 0 ? 'list' : 'add new'}</DialogContent>
        <DialogActions>
          <Button onClick={onConfirm} color="primary" variant="contained">
            Done
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
