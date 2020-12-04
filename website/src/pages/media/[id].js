/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { DataStore } from '@aws-amplify/datastore';
import { useRouter } from 'next/router';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';

import Layout from 'src/Layout';
import { Media } from 'src/models';

const useStyles = makeStyles((theme) => ({
  toolbar: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2),
  },
  grow: {
    flexGrow: 1,
  },
  player: {
    paddingTop: '56.25%',
    position: 'relative',
    '& > *': {
      position: 'absolute',
      top: 0,
    },
  },
}));

const getMedia = async (setMedia, id) => {
  const media = await DataStore.query(Media, id);
  if (!Array.isArray(media)) setMedia(media);
};

const MediaPage = () => {
  const classes = useStyles();
  const router = useRouter();

  const { id } = router.query;

  const [media, setMedia] = useState({});
  useEffect(() => getMedia(setMedia, id), [setMedia, id]);

  const { channels = [], createdAt, description = '', tags = [], title = '', transcripts = [], url } = media;

  if (createdAt) {
    console.log(createdAt);
    console.log(new Date(createdAt));
    console.log(new Date(createdAt).getTime());
    console.log(Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'short' }).format(new Date(createdAt)));
  }

  // EXAMPLE UPDATE MEDIA
  const handleSave = useCallback(
    async ({ title, description, tags }) =>
      setMedia(
        await DataStore.save(
          Media.copyOf(media, (updated) => {
            updated.title = title;
            updated.description = description;
            updated.tags = tags;
          }),
        ),
      ),
    [media, setMedia],
  );

  return (
    <Layout>
      <Toolbar className={classes.toolbar} disableGutters>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={8}>
            <Typography component="h1" gutterBottom variant="h4">
              {title}
            </Typography>
            <Typography color="textSecondary">
              Published on{' '}
              {createdAt
                ? Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'short' }).format(new Date(createdAt))
                : null}{' '}
              in {`Default Channel`}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button color="primary" onClick={() => console.log('Import Transcript')}>
              Import transcript
            </Button>
            <Button variant="contained" color="primary" onClick={() => console.log('Transcribe')}>
              Transcribe
            </Button>
          </Grid>
        </Grid>
      </Toolbar>
      <Grid container direction="row-reverse" spacing={5}>
        <Grid item xs={12} sm={4}>
          Description
          <br />
          Tags: {tags?.map((tag) => `"${tag}" + `)}
        </Grid>
        <Grid item xs={12} sm={8}>
          <ReactPlayer height="auto" width="auto" url={url} controls className={classes.player} />
        </Grid>
      </Grid>

      <h6>Transcripts</h6>
      <ol>
        {transcripts ? (
          transcripts.map((transcript) => (
            <li key={transcript.id}>
              {transcript.title} [{transcript.type}]
            </li>
          ))
        ) : (
          <h6>loading</h6>
        )}
      </ol>
    </Layout>
  );
};

export default MediaPage;
