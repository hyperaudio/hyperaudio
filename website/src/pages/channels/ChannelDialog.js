import React from 'react';

import Autocomplete from '@material-ui/lab/Autocomplete';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

export default function ChannelDialog({ allTags = [], data, onConfirm, onCancel, open = false }) {
  const [description, setDescription] = React.useState();
  const [tags, setTags] = React.useState();
  const [title, setTitle] = React.useState();
  const [titleError, setTitleError] = React.useState();

  const onSubmit = () => {
    if (title.length === 0) {
      setTitleError('Please give your new channel a title');
      return;
    }
    const payload = {
      description: description.trim(),
      tags: tags.map(tag => tag.trim()),
      title: title.trim(),
    };
    onConfirm(payload);
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
          <TextField
            error={titleError?.length > 0}
            fullWidth
            helperText={titleError}
            label="Title"
            margin="dense"
            onChange={e => setTitle(e.target.value)}
            value={title}
          />
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
            id="channels-filled"
            limitTags={3}
            multiple
            onChange={(e, v) => setTags(v)}
            options={allTags}
            renderInput={params => <TextField {...params} fullWidth label="Tags" margin="dense" />}
            renderTags={(value, getTagProps) =>
              value?.map((option, index) => (
                <Chip variant="outlined" label={option} {...getTagProps({ index })} key={option} size="small" />
              ))
            }
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
