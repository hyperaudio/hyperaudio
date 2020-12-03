import React from 'react';

import Autocomplete from '@material-ui/lab/Autocomplete';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';

import Layout from 'src/Layout';

const useStyles = makeStyles((theme) => ({
  toolbar: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2),
  },
  grow: {
    flexGrow: 1,
  },
  container: {
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
  divider: {
    marginBottom: theme.spacing(3),
    marginTop: theme.spacing(3),
  },
}));

export default function AddMediaPage() {
  const classes = useStyles();

  const [channels, setChannels] = React.useState([]);
  const [description, setDescription] = React.useState('');
  const [tags, setTags] = React.useState([]);
  const [title, setTitle] = React.useState('');
  const [url, setUrl] = React.useState('');

  const allChannels = [
    { id: 0, title: 'Music' },
    { id: 0, title: 'Geometry' },
  ]; // TODO: should be passed down
  const allTags = [
    { id: 1, title: 'Remix' },
    { id: 1, title: 'Audio' },
  ]; // TODO: should be passed down

  const onAddNewMedia = () => {
    console.log('onAddNewMedia', { url, title, description, channels, tags });
  };

  return (
    <Layout>
      <Toolbar className={classes.toolbar} disableGutters>
        <Typography component="h1" gutterBottom variant="h4">
          Add new media
        </Typography>
        <div className={classes.grow} />
      </Toolbar>
      <Paper>
        <Container className={classes.container}>
          <form>
            <TextField
              fullWidth
              helperText="Enter a valid Youtube URL"
              label="URL"
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=xyz"
              required
              type="url"
              value={url}
            />
            {url?.length > 0 ? (
              <>
                <TextField
                  fullWidth
                  label="Title"
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  type="text"
                  value={title}
                />
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  onChange={(e) => setDescription(e.target.value)}
                  rowsMax={3}
                  type="text"
                  value={description}
                />
                <div className={classes.divider} />
                <Autocomplete
                  freeSolo
                  id="channels-filled"
                  multiple
                  onChange={(e, v) => setChannels(v)}
                  onInputChange={(args) => console.log('onInputChange', args)}
                  options={allChannels.map((option) => option.title)}
                  renderInput={(params) => (
                    <TextField {...params} helperText="Add this media to channels" label="Channels" />
                  )}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip variant="outlined" label={option} {...getTagProps({ index })} key={index} />
                    ))
                  }
                  value={channels}
                />
                <Autocomplete
                  freeSolo
                  id="tags-filled"
                  multiple
                  onChange={(e, v) => setTags(v)}
                  onInputChange={(args) => console.log('onInputChange', args)}
                  options={allTags.map((option) => option.title)}
                  renderInput={(params) => <TextField {...params} helperText="Tag your media" label="Tags" />}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip variant="outlined" label={option} {...getTagProps({ index })} key={index} />
                    ))
                  }
                  value={tags}
                />
                <div className={classes.divider} />
                <Button color="primary" onClick={onAddNewMedia} variant="contained">
                  Add Media
                </Button>
              </>
            ) : null}
          </form>
        </Container>
      </Paper>
    </Layout>
  );
}
