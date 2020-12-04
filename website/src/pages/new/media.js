import React, { useCallback } from 'react';
import { useRouter } from 'next/router';
import { DataStore } from '@aws-amplify/datastore';

import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';

import Layout from 'src/Layout';
import MediaForm from 'src/features/MediaForm';
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
    { id: 0, title: 'Music' },
    { id: 0, title: 'Geometry' },
  ]; // TODO: should be passed down

  const allTags = [
    { id: 1, title: 'Remix' },
    { id: 1, title: 'Audio' },
  ]; // TODO: should be passed down

  const onAddNewMedia = useCallback(async ({ channels, description, tags, title, url }) => {
    // TODO: channels
    console.log({ url, title, description, tags });
    const media = await DataStore.save(new Media({ url, title, description, tags }));
    console.log(media);
    router.push(`/media/${media.id}`);
  }, []);

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
          <MediaForm allChannels={allChannels} allTags={allTags} onSubmit={onAddNewMedia} />
        </Container>
      </Paper>
    </Layout>
  );
};

export default AddMediaPage;
