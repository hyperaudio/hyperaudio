/* eslint-disable no-shadow */
import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { DataStore } from '@aws-amplify/datastore';
import ReactPlayer from 'react-player';
import Embedly from 'embedly';
import Amplify, { Storage } from 'aws-amplify';

import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import TextField from '@material-ui/core/TextField';
import LinearProgress from '@material-ui/core/LinearProgress';

import Layout from 'src/Layout';
import { Media } from '../../models';

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

const AddMediaPage = () => {
  const classes = useStyles();
  const router = useRouter();

  const allChannels = [
    // { id: 0, title: 'Music' },
    // { id: 0, title: 'Geometry' },
  ]; // TODO: should be passed down

  const allTags = [
    // { id: 1, title: 'Remix' },
    // { id: 1, title: 'Audio' },
  ]; // TODO: should be passed down

  const [channels, setChannels] = useState([]);
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState([]);
  const [metadata, setMetadata] = useState({});
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [extracted, setExtracted] = useState(false);
  const [file, setFile] = useState();
  const [progress, setProgress] = useState(0);

  const isValid = useMemo(() => url.startsWith('s3://hyperpink-data/') || ReactPlayer.canPlay(url), [url]);

  const onFileChange = useCallback(
    (e) => {
      setFile(e.target.files[0]);
      console.log(e.target.files[0]);
    },
    [setFile],
  );

  const upload = useCallback(() => {
    Storage.put(`test/${file.name}`, file, {
      // level: 'public',
      // acl: 'public-read',
      progressCallback: (progress) => {
        console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
        setProgress((100 * progress.loaded) / progress.total);
      },
    })
      .then(({ key }) => setUrl(`s3://hyperpink-data/public/${key}`))
      .catch((err) => console.log(err));
  }, [setProgress, setUrl, file]);

  useEffect(() => {
    if (!isValid && extracted) setExtracted(false);
    if (!isValid) return;
    if (extracted) return;

    setExtracted(true);

    const { NEXT_PUBLIC_EMBEDLY_KEY: key } = process.env;
    if (!key) return;

    // TODO use https://api.embed.ly/1/oembed?key=KEY&urls=URL
    const embedly = new Embedly({ key, secure: true });
    embedly.oembed({ url }, (err, objs = []) => {
      if (err) return;

      const data = objs.pop();
      const { title = '', description = '', provider_name: platform } = data;
      setTitle(title);
      setDescription(description);
      setMetadata({ embedly: data });
      if (platform && !tags.includes(platform)) setTags([...tags, platform]);
    });
  }, [isValid, url, tags, setTitle, setDescription, setTags, setMetadata, setExtracted]);

  const onAddNewMedia = useCallback(async () => {
    // TODO: channels
    // console.log({ url, title, description, tags });
    const media = await DataStore.save(
      new Media({ url, title, description, tags, metadata: JSON.stringify(metadata) }),
    );
    console.log(media);
    router.push(`/media/${media.id}`);
  }, [url, title, description, tags, metadata]);

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
            <input type="file" accept="audio/*, video/*" onChange={onFileChange} />
            <Button color="primary" onClick={upload} variant="contained">
              Upload
            </Button>
            <LinearProgress variant="determinate" value={progress} />
            <TextField
              fullWidth
              error={!isValid}
              helperText={isValid ? null : 'Enter a valid media URL'}
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
                <Button color="primary" onClick={onAddNewMedia} variant="contained" disabled={!isValid}>
                  Save
                </Button>
              </>
            ) : null}
          </form>
        </Container>
      </Paper>
    </Layout>
  );
};

export default AddMediaPage;
