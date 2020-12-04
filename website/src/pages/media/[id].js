/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
import React, { useState, useEffect, useCallback } from 'react';
import ReactPlayer from 'react-player';
import { DataStore } from '@aws-amplify/datastore';
import { useRouter } from 'next/router';

import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
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
  actions: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
      '& > *': {
        marginLeft: theme.spacing(2),
      },
    },
  },
  player: {
    paddingTop: '56.25%',
    position: 'relative',
    marginBottom: theme.spacing(2),
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

  const formattedCreatedAt = createdAt
    ? Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      }).format(new Date(createdAt))
    : null;

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

  const channel = null;

  return (
    <Layout>
      <Toolbar className={classes.toolbar} disableGutters>
        <Typography component="h1" gutterBottom variant="h4">
          {title}
        </Typography>
        <div className={classes.grow} />
        <div className={classes.actions}>
          <Button color="primary" onClick={() => console.log('Import Transcript')}>
            Import transcript
          </Button>
          <Button variant="contained" color="primary" onClick={() => console.log('Transcribe')}>
            Transcribe
          </Button>
        </div>
      </Toolbar>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <ReactPlayer height="auto" width="auto" url={url} controls className={classes.player} />
          {description && (
            <Typography gutterBottom variant="body2">
              {description}
            </Typography>
          )}
          <Typography color="textSecondary" gutterBottom variant="body2">
            Added on {createdAt ? formattedCreatedAt : null}
            {channel && `in {channel}`}
          </Typography>
          {tags?.map((tag) => (
            <Chip key={tag}>{tag}</Chip>
          ))}
        </Grid>
        <Grid item xs={12} sm={6}>
          <List
            component="ul"
            aria-labelledby="nested-list-subheader"
            subheader={
              <ListSubheader component="div" disableGutters disableSticky id="nested-list-subheader">
                Available transcripts:
              </ListSubheader>
            }
          >
            {transcripts ? ( // TODO: add actionable invitation if length = 0
              transcripts.map((transcript) => (
                <ListItem button disableGutters divider key={transcript.id}>
                  <ListItemText primary={transcript.title} secondary={transcript.type} />
                </ListItem>
              ))
            ) : (
              <h6>loading</h6>
            )}
          </List>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default MediaPage;
