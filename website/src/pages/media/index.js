import React, { useState, useEffect } from 'react';
import NextLink from 'next/link';
import { DataStore } from '@aws-amplify/datastore';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Paper from '@material-ui/core/Paper';
import Skeleton from '@material-ui/lab/Skeleton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';

import Layout from 'src/Layout';
import { Channel, Media } from '../../models';

const listChannels = async (setChannels) => setChannels(await DataStore.query(Channel));
const listMedia = async (setMedia) => setMedia(await DataStore.query(Media));

const useStyles = makeStyles((theme) => ({
  toolbar: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2),
  },
  grow: {
    flexGrow: 1,
  },
}));

export default function MediaPage() {
  const classes = useStyles();

  const [channels, setChannels] = useState([]);
  const [media, setMedia] = useState([]);

  useEffect(() => {
    listChannels(setChannels);

    const subscription = DataStore.observe(Channel).subscribe((msg) => {
      console.log(msg.model, msg.opType, msg.element);
      listChannels(setChannels);
    });

    const handleConnectionChange = () => {
      const condition = navigator.onLine ? 'online' : 'offline';
      console.log(condition);
      if (condition === 'online') {
        listChannels(setChannels);
      }
    };

    window.addEventListener('online', handleConnectionChange);
    window.addEventListener('offline', handleConnectionChange);

    return () => subscription.unsubscribe();
  }, [setChannels]);

  useEffect(() => {
    listMedia(setMedia);

    const subscription = DataStore.observe(Media).subscribe((msg) => {
      console.log(msg.model, msg.opType, msg.element);
      listMedia(setMedia);
    });

    const handleConnectionChange = () => {
      const condition = navigator.onLine ? 'online' : 'offline';
      console.log(condition);
      if (condition === 'online') {
        listMedia(setMedia);
      }
    };

    window.addEventListener('online', handleConnectionChange);
    window.addEventListener('offline', handleConnectionChange);

    return () => subscription.unsubscribe();
  }, [setMedia]);

  // console.log(media);

  return (
    <Layout>
      <Toolbar className={classes.toolbar} disableGutters>
        <Typography component="h1" gutterBottom variant="h4">
          All your media
        </Typography>
        <div className={classes.grow} />
        <NextLink href="/new/media">
          <Button variant="contained" color="primary">
            New Media
          </Button>
        </NextLink>
      </Toolbar>
      <Paper>
        <List dense>
          {media
            ? media.map(({ id, title, description }) => (
                <NextLink key={id} href={`/media/${id}`}>
                  <ListItem button>
                    <ListItemText
                      primary={title}
                      secondary={description}
                      primaryTypographyProps={{ color: 'primary' }}
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end">
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                </NextLink>
              ))
            : Array.from({ length: 5 }, () => Math.floor(Math.random() * 40)).map((element, i) => {
                return (
                  <ListItem key={`${element}${i}`}>
                    <ListItemText
                      primary={<Skeleton variant="text" width="50%" />}
                      secondary={<Skeleton variant="text" width="20%" />}
                    />
                  </ListItem>
                );
              })}
        </List>
      </Paper>
    </Layout>
  );
}
