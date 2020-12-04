import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { DataStore } from '@aws-amplify/datastore';
import ReactPlayer from 'react-player';

import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';

import Layout from 'src/Layout';
import MediaForm from 'src/features/MediaForm';
import { Media } from 'src/models';

const useStyles = makeStyles((theme) => ({
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

export default function MediaPage() {
  const classes = useStyles();
  const router = useRouter();

  const { id } = router.query;

  const [media, setMedia] = useState({});
  useEffect(() => getMedia(setMedia, id), [setMedia, id]);

  const { description = '', tags = [], title = '', transcripts = [], url } = media;

  const onMediaUpdate = (o) => {
    console.log({ channels: o.channels, description: o.description, tags: o.tags, title: o.title });
  };

  return (
    <Layout>
      <Grid container direction="row-reverse" spacing={2}>
        <Grid item xs={12} sm={4}>
          <Typography variant="h6" component="h1">
            {title}
          </Typography>
          <Typography variant="body1">{description}</Typography>
          Tags:{' '}
          {tags?.map((tag) => (
            <Chip size="small" variant="outlined" key={tag.replace(/ /g, '-')}>
              {tag}
            </Chip>
          ))}
        </Grid>
        <Grid item xs={12} sm={8}>
          <ReactPlayer height="auto" width="auto" url={url} controls className={classes.player} />
        </Grid>
      </Grid>

      <MediaForm allChannels={[]} allTags={[]} data={{ url, title, description }} onSubmit={onMediaUpdate} />
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
}
