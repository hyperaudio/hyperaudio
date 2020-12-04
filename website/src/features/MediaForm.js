import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ReactPlayer from 'react-player';

import Autocomplete from '@material-ui/lab/Autocomplete';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import TextField from '@material-ui/core/TextField';
import makeStyles from '@material-ui/core/styles/makeStyles';

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

const MediaForm = ({ allChannels = [], allTags = [], data, onSubmit }) => {
  const classes = useStyles();

  const [channels, setChannels] = useState([]);
  const [description, setDescription] = useState(data?.description || '');
  const [tags, setTags] = useState([]);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState(data?.url || '');

  useEffect(() => {
    setDescription(data?.description);
    setChannels(data?.channels);
    setTags(data?.tags);
    setTitle(data?.title);
  }, [data]);

  const isValid = useMemo(() => ReactPlayer.canPlay(url), [url]);

  const handleSubmit = useCallback(() => {
    onSubmit({
      channels,
      description,
      tags,
      title,
      url,
    });
  }, [channels, description, tags, title, url]);

  return (
    <form>
      {!data?.url && (
        <TextField
          fullWidth
          error={!isValid}
          helperText="Enter a valid media URL"
          label="URL"
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=xyz"
          required
          type="url"
          value={url}
        />
      )}
      {data?.url || url?.length > 0 ? (
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
            renderInput={(params) => <TextField {...params} helperText="Add this media to channels" label="Channels" />}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip variant="outlined" label={option} {...getTagProps({ index })} key={option} />
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
                <Chip variant="outlined" label={option} {...getTagProps({ index })} key={option} />
              ))
            }
            value={tags}
          />
          <div className={classes.divider} />
          <Button color="primary" onClick={handleSubmit} variant="contained" disabled={!isValid}>
            Save
          </Button>
        </>
      ) : null}
    </form>
  );
};

export default MediaForm;
