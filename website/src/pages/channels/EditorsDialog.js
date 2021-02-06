import React from 'react';

import Autocomplete from '@material-ui/lab/Autocomplete';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import ClearIcon from '@material-ui/icons/Clear';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles(theme => ({
  list: {
    maxHeight: '300px',
    minHeight: '200px',
    overflowY: 'auto',
  },
  avatar: {
    background: theme.palette.primary.light,
    fontSize: theme.typography.pxToRem(16),
    height: theme.spacing(4),
    lineHeight: theme.spacing(4),
    textTransform: 'uppercase',
    width: theme.spacing(4),
  },
}));

export default function EditorsDialog({ users = [], data, onConfirm, onCancel, open = false }) {
  const classes = useStyles();

  const [editors, setEditors] = React.useState([]);

  // const editors = users.filter(o => data.editors.includes(o.id));
  // const options = users.map(({ id, username }) => ({ id, username }));

  const sortList = arr =>
    arr?.sort((a, b) => {
      if (a.username < b.username) {
        return -1;
      }
      if (a.username > b.username) {
        return 1;
      }
      return 0;
    }) || [];

  const onRemoveEditor = id => () => {
    console.log({ id });
    const arr = editors;
    const i = arr?.findIndex(o => o.id === id);
    console.log({ i });
    if (i > -1) {
      console.log('onRemoveEditor');
      arr.splice(i, 1);
      console.log({ arr });
      setEditors(arr);
    }
    // return i > -1 ?  : null;
  };

  const onDone = () => onConfirm(editors.map(({ id }) => id));

  React.useEffect(() => {
    setEditors(users.filter(o => data?.editors?.includes(o.id)));
  }, []);

  console.log({ editors });
  // console.log({ users });

  return (
    <Dialog
      PaperProps={{ style: { width: '100%' } }}
      aria-labelledby="dialog-title"
      maxWidth="xs"
      onClose={onCancel}
      open={open}
    >
      <DialogTitle id="dialog-title">Manage channel editors</DialogTitle>
      <form>
        <DialogContent>
          <Autocomplete
            autoHighlight
            fullWidth
            getOptionLabel={o => o?.username || ''}
            disableClearable
            id="editors"
            multiple
            // inputValue=""
            onChange={(e, v) => setEditors(v)}
            filterSelectedOptions
            options={users}
            renderTags={() => null}
            renderInput={params => (
              <TextField {...params} fullWidth label="Add editor…" margin="dense" placeholder="Look up by username" />
            )}
            value={editors}
          />
          {editors?.length > 0 ? (
            <List className={classes.list} dense>
              {sortList(editors).map(({ id, name, username }) => (
                <ListItem disableGutters divider key={id}>
                  <ListItemAvatar>
                    <Avatar className={classes.avatar}>{username.charAt(0)}</Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={username} secondary={name} />
                  <ListItemSecondaryAction>
                    <Tooltip title="Remove editor">
                      <IconButton edge="end" size="small" onClick={onRemoveEditor(id)}>
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>No editors assigned to this channel.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={onDone} color="primary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
