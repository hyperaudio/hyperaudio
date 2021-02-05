import React from 'react';

import Autocomplete from '@material-ui/lab/Autocomplete';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

export default function ChannelDialog({ allTags = [], data, onConfirm, onCancel, open = false }) {
  const [description, setDescription] = React.useState();
  const [tags, setTags] = React.useState();
  const [title, setTitle] = React.useState();

  const onSubmit = () => {
    onConfirm({ description, tags, title });
  };

  React.useEffect(() => {
    setDescription(data?.description || '');
    setTags(data?.tags || []);
    setTitle(data?.title || '');
  }, [data]);

  return (
    <Dialog
      PaperProps={{ style: { width: '100%' } }}
      aria-labelledby="dialog-title"
      maxWidth="xs"
      onClose={onCancel}
      open={open}
    >
      <DialogTitle id="dialog-title">{data?.title ? 'Edit channel' : 'New channel'}</DialogTitle>
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
            onChange={(event, newValue) => {
              console.log({ newValue });
              if (typeof newValue === 'string') {
                setTags({
                  title: newValue,
                });
              } else if (newValue && newValue.inputValue) {
                // Create a new value from the user input
                setTags({
                  title: newValue.inputValue,
                });
              } else {
                setTags(newValue);
              }
            }}
            options={allTags}
            getOptionLabel={option => {
              // Value selected with enter, right from the input
              if (typeof option === 'string') {
                return option;
              }
              // Add "xxx" option created dynamically
              if (option.inputValue) {
                return option.inputValue;
              }
              // Regular option
              // return option.title;
              return option.toString();
            }}
            renderInput={params => <TextField {...params} label="Tags" margin="dense" fullWidth />}
            // renderOption={option => option.toString()}
            value={tags}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={onSubmit} color="primary" variant="contained">
            {data ? 'Save' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
