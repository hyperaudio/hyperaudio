import React from 'react';

import Autocomplete from '@material-ui/lab/Autocomplete';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

export default function NewChannelDialog({ allTags = [], onConfirm, onCancel, open }) {
  const [description, setDescription] = React.useState('');
  const [tags, setTags] = React.useState([]);
  const [title, setTitle] = React.useState('');

  const onSubmit = () => {
    onConfirm({ description, tags, title });
  };

  return (
    <Dialog
      PaperProps={{ style: { width: '100%' } }}
      aria-labelledby="dialog-title"
      maxWidth="xs"
      onClose={onCancel}
      open={open}
    >
      <DialogTitle id="dialog-title">New channel</DialogTitle>
      <form>
        <DialogContent>
          <TextField fullWidth label="Title" margin="dense" onChange={e => setTitle(e.target.value)} value={title} />
          <TextField
            fullWidth
            label="Description"
            margin="dense"
            multiline
            onChange={e => setDescription(e.target.value)}
            value={description}
          />
          <Autocomplete
            freeSolo
            onChange={(e, value) => setTags(value)}
            options={allTags}
            renderInput={params => <TextField {...params} label="Tags" margin="dense" fullWidth />}
            renderOption={option => option.title}
            value={tags}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={onSubmit} color="primary" variant="contained">
            Create
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
