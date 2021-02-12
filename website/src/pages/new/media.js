import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import ReactPlayer from 'react-player';
import axios from 'axios';
import Embedly from 'embedly';
import { Storage, withSSRContext, DataStore } from 'aws-amplify';
import { serializeModel, deserializeModel } from '@aws-amplify/datastore/ssr';
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';

import Autocomplete from '@material-ui/lab/Autocomplete';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Chip from '@material-ui/core/Chip';
import CloseIcon from '@material-ui/icons/Close';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import LinearProgress from '@material-ui/core/LinearProgress';
import Link from '@material-ui/core/Link';
import OndemandVideoIcon from '@material-ui/icons/OndemandVideo';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';

import FileInput from 'src/components/FileInput';
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

const useStyles = () =>
  makeStyles(theme => ({
    toolbar: {
      marginTop: theme.spacing(4),
      marginBottom: theme.spacing(2),
    },
    grow: {
      flexGrow: 1,
    },
    card: { position: 'relative' },
    progress: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
    },
    cardHeader: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
    },
    cardActionArea: {},
    cardActionAreaDisabled: { opacity: '0.5', pointerEvents: 'none' },
    cardContent: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: theme.spacing(2.5),
      textAlign: 'center',
      [theme.breakpoints.up('md')]: {
        minHeight: '360px',
        padding: theme.spacing(5),
      },
    },
    cardIcon: {
      marginBottom: theme.spacing(1),
    },
    cardPrompt: { marginBottom: theme.spacing(2) },
    actionbar: {
      '& > *': {
        marginRight: theme.spacing(1.5),
      },
    },
  }));

const MetaForm = ({
  allChannels,
  allTags,
  channels,
  description,
  isValid,
  onAddNewMedia,
  onReset,
  setChannels,
  setDescription,
  setTags,
  setTitle,
  tags,
  title,
}) => {
  const classes = useStyles()();
  return (
    <form>
      <TextField
        autoFocus
        fullWidth
        label="Title"
        margin="dense"
        onChange={e => setTitle(e.target.value)}
        required
        size="small"
        type="text"
        value={title}
      />
      <TextField
        fullWidth
        label="Description"
        margin="dense"
        multiline
        onChange={e => setDescription(e.target.value)}
        rowsMax={3}
        size="small"
        type="text"
        value={description}
      />
      <Autocomplete
        freeSolo
        id="channels-filled"
        multiple
        onChange={(e, v) => setChannels(v)}
        onInputChange={args => console.log('onInputChange', args)}
        options={allChannels.map(option => option.title)}
        renderInput={params => <TextField {...params} label="Add to channels" margin="dense" size="small" />}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip variant="outlined" label={option} {...getTagProps({ index })} key={option} size="small" />
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
        renderInput={params => <TextField {...params} label="Add tags" margin="dense" size="small" />}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip variant="outlined" label={option} {...getTagProps({ index })} key={option} size="small" />
          ))
        }
        value={tags}
      />
      <Toolbar disableGutters className={classes.actionbar}>
        <Button color="primary" disabled={!isValid} onClick={onAddNewMedia} variant="contained" size="small">
          Finish
        </Button>
        <Button onClick={onReset} size="small">
          Cancel
        </Button>
      </Toolbar>
    </form>
  );
};

export default function AddMediaPage(initialData) {
  const router = useRouter();
  const [user] = useState(initialData.user ? deserializeModel(User, initialData.user) : null);

  useEffect(() => {
    onAuthUIStateChange((authState, authData) => {
      console.log({ authState, authData });
      if (authState !== AuthState.SignedIn || !authData) router.push('/auth/?redirect=/new/media');
    });
  }, [router]);

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
  const [extracted, setExtracted] = useState(false);
  const [file, setFile] = useState();
  const [hasUrl, setHasUrl] = useState(false);
  const [metadata, setMetadata] = useState({});
  const [progress, setProgress] = useState(0);
  const [source, setSource] = useState(null);
  const [tags, setTags] = useState([]);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');

  const isValid = useMemo(() => url.startsWith('s3://hyperpink-data/') || ReactPlayer.canPlay(url), [url]);

  const onFileChange = useCallback(({ target: { files } }) => setFile(files[0]), []);

  const onUpload = useCallback(() => {
    setTitle(file.name);
    Storage.put(`test/${file.name}`, file, {
      progressCallback: ({ loaded, total }) => setProgress((100 * loaded) / total),
    })
      .then(({ key }) => setUrl(`s3://hyperpink-data/public/${key}`))
      .catch(err => console.log(err));
  }, [file]);

  useEffect(() => {
    if (!isValid && extracted) setExtracted(false);
    if (!isValid) return;
    if (extracted) return;

    setExtracted(true);

    const oembed = async () => {
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
    };

    oembed();
  }, [isValid, url, tags, extracted]);

  const onAddNewMedia = useCallback(async () => {
    // TODO: channels
    // console.log({ url, title, description, tags });
    const media = await DataStore.save(
      new Media({ url, title, description, tags, metadata: JSON.stringify(metadata), owner: user.id }),
    );

    console.log({ media });

    router.push(`/media/${media.id}`);
  }, [url, title, description, tags, metadata, user, router]);

  const onReset = () => {
    setFile(undefined);
    setHasUrl(false);
    setProgress(0);
    setSource(null);
    setUrl('');
    // TODO: Reset things for good
  };

  const isUploading = Boolean(file) && progress > 0;
  const classes = useStyles()();
  const theme = useTheme();
  const isMedium = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <>
      <Layout>
        <Toolbar className={classes.toolbar} disableGutters>
          <Typography component="h1" variant="h4">
            New media
          </Typography>
          <div className={classes.grow} />
        </Toolbar>
        <Container disableGutters>
          <Grid container spacing={isMedium ? 4 : 2}>
            <Grid item xs={12} md={6}>
              <Card className={classes.card}>
                {source === 'upload' ? (
                  <>
                    <CardHeader
                      action={
                        <IconButton onClick={onReset}>
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      }
                      className={classes.cardHeader}
                    />
                    <CardContent className={classes.cardContent}>
                      {isUploading ? (
                        <>
                          <LinearProgress variant="determinate" value={progress} className={classes.progress} />
                          <MetaForm
                            allChannels={allChannels}
                            allTags={allTags}
                            channels={channels}
                            description={description}
                            isValid={isValid}
                            onAddNewMedia={onAddNewMedia}
                            onReset={onReset}
                            setChannels={setChannels}
                            setDescription={setDescription}
                            setTags={setTags}
                            setTitle={setTitle}
                            tags={tags}
                            title={title}
                          />
                        </>
                      ) : (
                        <div>
                          <Typography
                            className={classes.cardPrompt}
                            color="textSecondary"
                            gutterBottom
                            noWrap
                            variant="body1"
                          >
                            {file ? file.name : 'Choose a file to continue…'}
                          </Typography>
                          <Grid container spacing={2} justify="center">
                            <Grid item>
                              <FileInput
                                buttonProps={{
                                  color: file ? 'default' : 'primary',
                                  disabled: progress > 0,
                                  size: 'small',
                                  variant: 'contained',
                                }}
                                inputProps={{}}
                                label={file ? 'Choose different…' : 'Choose…'}
                                labelProps={{}}
                                onChange={onFileChange}
                              />
                            </Grid>
                            <Grid item>
                              <Button
                                color={file ? 'primary' : 'default'}
                                disabled={!file || progress > 0}
                                onClick={onUpload}
                                size="small"
                                variant="contained"
                              >
                                Upload
                              </Button>
                            </Grid>
                          </Grid>
                        </div>
                      )}
                    </CardContent>
                  </>
                ) : (
                  <CardActionArea
                    className={`${classes.cardActionArea} ${hasUrl ? classes.cardActionAreaDisabled : ''}`}
                    onClick={() => setSource('upload')}
                  >
                    <CardContent className={classes.cardContent}>
                      <div>
                        <CloudUploadIcon fontSize="large" className={classes.cardIcon} />
                        <Typography component="h2" variant="h6" gutterBottom>
                          Upload
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                          Upload a valid{' '}
                          <Tooltip title="m4a, mp4a, mpga, mp2, mp2a, mp3, m2a, m3a, wav, weba, aac, oga, spx">
                            <Link color="inherit" underline="always">
                              audio
                            </Link>
                          </Tooltip>{' '}
                          or{' '}
                          <Tooltip title="mp4, og[gv], webm, mov, m4v">
                            <Link color="inherit" underline="always">
                              video
                            </Link>
                          </Tooltip>{' '}
                          file from your device.
                        </Typography>
                      </div>
                    </CardContent>
                  </CardActionArea>
                )}
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card className={classes.card}>
                {source === 'url' ? (
                  <>
                    <CardHeader
                      action={
                        <IconButton onClick={onReset}>
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      }
                      className={classes.cardHeader}
                    />
                    <CardContent className={classes.cardContent}>
                      {hasUrl ? (
                        <MetaForm
                          allChannels={allChannels}
                          allTags={allTags}
                          channels={channels}
                          description={description}
                          isValid={isValid}
                          onAddNewMedia={onAddNewMedia}
                          onReset={onReset}
                          setChannels={setChannels}
                          setDescription={setDescription}
                          setTags={setTags}
                          setTitle={setTitle}
                          tags={tags}
                          title={title}
                        />
                      ) : (
                        <form>
                          <TextField
                            autoFocus
                            error={url.length > 0 && !isValid}
                            fullWidth
                            helperText="Youtube, Vimeo, Soundcloud or direct link to a media file"
                            label="Enter a valid media URL"
                            onChange={e => setUrl(e.target.value)}
                            placeholder="https://www.youtube.com/watch?v=xyz"
                            required
                            type="url"
                            value={url}
                          />
                          <Toolbar disableGutters className={classes.actionbar}>
                            <Button
                              color="primary"
                              disabled={!isValid}
                              onClick={() => setHasUrl(true)}
                              size="small"
                              variant="contained"
                            >
                              Continue
                            </Button>
                            <Button onClick={onReset} size="small">
                              Cancel
                            </Button>
                          </Toolbar>
                        </form>
                      )}
                    </CardContent>
                  </>
                ) : (
                  <CardActionArea
                    className={`${classes.cardActionArea} ${isUploading ? classes.cardActionAreaDisabled : ''}`}
                    onClick={() => setSource('url')}
                  >
                    <CardContent className={classes.cardContent}>
                      <div>
                        <OndemandVideoIcon fontSize="large" className={classes.cardIcon} />
                        <Typography component="h2" variant="h6" gutterBottom>
                          Source from Web
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                          Source{' '}
                          <Tooltip title="Youtube, Vimeo, SoundCloud">
                            <Link color="inherit" underline="always">
                              publicly available media
                            </Link>
                          </Tooltip>{' '}
                          or{' '}
                          <Tooltip title="m4a, mp4a, mpga, mp2, mp2a, mp3, m2a, m3a, wav, weba, aac, oga, spx, mp4, og[gv], webm, mov, m4v">
                            <Link color="inherit" underline="always">
                              accepted file type
                            </Link>
                          </Tooltip>{' '}
                          links.
                        </Typography>
                      </div>
                    </CardContent>
                  </CardActionArea>
                )}
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Layout>
    </>
  );
}

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
