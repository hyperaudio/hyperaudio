import React from 'react';

import Autocomplete from '@material-ui/lab/Autocomplete';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

export default function EditorsDialog({ users = [], data, onConfirm, onCancel, open = false }) {
  const [editors, setEditors] = React.useState();

  React.useEffect(() => {
    setEditors(data?.editors);
  }, [data?.editors]);

  console.log({ users });

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
        <DialogContent>
          {/* <Autocomplete
            freeSolo
            id="channels-filled"
            limitTags={3}
            multiple
            onChange={(e, v) => setEditors(v)}
            options={users}
            renderInput={params => <TextField {...params} fullWidth label="Users" margin="dense" />}
            renderTags={(value, getTagProps) =>
              value?.map((option, index) => (
                <Chip
                  {...getTagProps({ index })}
                  key={option.id}
                  label={option.username}
                  size="small"
                  variant="outlined"
                />
              ))
            }
            value={editors}
          /> */}
          {editors?.length > 0 ? 'list' : 'add new'}
        </DialogContent>
        <DialogActions>
          <Button onClick={onConfirm} color="primary" variant="contained">
            Done
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
