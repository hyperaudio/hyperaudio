import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import ReactPlayer from 'react-player';
import axios from 'axios';
import Embedly from 'embedly';
import { Storage, withSSRContext, DataStore } from 'aws-amplify';
import { serializeModel, deserializeModel } from '@aws-amplify/datastore/ssr';
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';

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
import { Media, User, Channel, UserChannel } from '../../models';

// https://github.com/cookpete/react-player/blob/master/src/patterns.js
const MATCH_URL_YOUTUBE = /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})|youtube\.com\/playlist\?list=|youtube\.com\/user\//;
const MATCH_URL_SOUNDCLOUD = /(?:soundcloud\.com|snd\.sc)\/[^.]+$/;
const MATCH_URL_VIMEO = /vimeo\.com\/.+/;
const AUDIO_EXTENSIONS = /\.(m4a|mp4a|mpga|mp2|mp2a|mp3|m2a|m3a|wav|weba|aac|oga|spx)($|\?)/i;
const VIDEO_EXTENSIONS = /\.(mp4|og[gv]|webm|mov|m4v)($|\?)/i;
const HLS_EXTENSIONS = /\.(m3u8)($|\?)/i;
const DASH_EXTENSIONS = /\.(mpd)($|\?)/i;
const FLV_EXTENSIONS = /\.(flv)($|\?)/i;

const useStyles = makeStyles(theme => ({
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

const AddMediaPage = initialData => {
  const classes = useStyles();
  const router = useRouter();

  const [user] = useState(initialData.user ? deserializeModel(User, initialData.user) : null);
  console.log({ user });

  useEffect(() => {
    onAuthUIStateChange((authState, authData) => {
      console.log({ authState, authData });
      if (authState !== AuthState.SignedIn || !authData) router.push('/auth/?redirect=/new/media');
    });
  }, []);

  // const allChannels = [
  //   // { id: 0, title: 'Music' },
  //   // { id: 0, title: 'Geometry' },
  // ];

  // curent user's channels
  const allChannels = user.channels ?? [];

  // TBD
  const allTags = [
    // { id: 1, title: 'Remix' },
    // { id: 1, title: 'Audio' },
  ];

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

  const onFileChange = useCallback(({ target: { files } }) => setFile(files[0]), []);

  const upload = useCallback(
    () =>
      Storage.put(`test/${file.name}`, file, {
        progressCallback: ({ loaded, total }) => setProgress((100 * loaded) / total),
      })
        .then(({ key }) => setUrl(`s3://hyperpink-data/public/${key}`))
        .catch(err => console.log(err)),
    [file],
  );

  useEffect(async () => {
    if (!isValid && extracted) setExtracted(false);
    if (!isValid) return;
    if (extracted) return;

    setExtracted(true);

    if (MATCH_URL_YOUTUBE.test(url)) {
      const { data } = await axios.request({
        method: 'get',
        url: '/api/oembed/youtube',
        params: { url },
      });

      const { title = '', description = '', provider_name: platform } = data;
      setTitle(title);
      setDescription(description);
      setMetadata({ oembed: data });
      if (platform && !tags.includes(platform)) setTags([...tags, platform]);

      return;
    }

    if (MATCH_URL_VIMEO.test(url)) {
      const { data } = await axios.request({
        method: 'get',
        url: 'https://vimeo.com/api/oembed.json',
        params: { url },
      });

      const { title = '', description = '', provider_name: platform } = data;
      setTitle(title);
      setDescription(description);
      setMetadata({ oembed: data });
      if (platform && !tags.includes(platform)) setTags([...tags, platform]);

      return;
    }

    if (MATCH_URL_SOUNDCLOUD.test(url)) {
      const { data } = await axios.request({
        method: 'get',
        url: 'https://soundcloud.com/oembed',
        params: { url, format: 'json' },
      });

      const { title = '', description = '', provider_name: platform } = data;
      setTitle(title);
      setDescription(description);
      setMetadata({ oembed: data });
      if (platform && !tags.includes(platform)) setTags([...tags, platform]);

      return;
    }

    const file = [AUDIO_EXTENSIONS, VIDEO_EXTENSIONS, HLS_EXTENSIONS, DASH_EXTENSIONS, FLV_EXTENSIONS].find(pattern =>
      pattern.test(url),
    );

    if (file) return;

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
  }, [isValid, url, tags]);

  const onAddNewMedia = useCallback(async () => {
    // TODO: channels
    // console.log({ url, title, description, tags });
    const media = await DataStore.save(
      new Media({ url, title, description, tags, metadata: JSON.stringify(metadata), owner: user.id }),
    );

    router.push(`/media/${media.id}`);
  }, [url, title, description, tags, metadata, user]);

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
              onChange={e => setUrl(e.target.value)}
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
                  onChange={e => setTitle(e.target.value)}
                  required
                  type="text"
                  value={title}
                />
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  onChange={e => setDescription(e.target.value)}
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
                  onInputChange={args => console.log('onInputChange', args)}
                  options={allChannels.map(option => option.title)}
                  renderInput={params => (
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
                  onInputChange={args => console.log('onInputChange', args)}
                  options={allTags.map(option => option.title)}
                  renderInput={params => <TextField {...params} helperText="Tag your media" label="Tags" />}
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

export const getServerSideProps = async context => {
  const { Auth, DataStore } = withSSRContext(context);

  try {
    const {
      attributes: { sub },
    } = await Auth.currentAuthenticatedUser();

    const user = serializeModel(await DataStore.query(User, sub));
    const userChannels = serializeModel(
      (await DataStore.query(UserChannel)).filter(c => c.user.id === user.id).map(({ channel }) => channel),
    );

    return { props: { user, userChannels } };
  } catch (error) {
    return { redirect: { destination: '/auth/?redirect=/new/media', permanent: false } };
  }
};

export default AddMediaPage;
