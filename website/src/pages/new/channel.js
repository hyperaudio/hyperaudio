import React, { useCallback, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { withSSRContext, DataStore } from 'aws-amplify';
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

import Layout from 'src/Layout';
import { Channel, User, UserChannel } from '../../models';

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

const AddChannelPage = initialData => {
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

  // TBD
  const allTags = [
    // { id: 1, title: 'Remix' },
    // { id: 1, title: 'Audio' },
  ];

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState([]);
  const [metadata, setMetadata] = useState({});

  const onAddNewChannel = useCallback(async () => {
    const channel = await DataStore.save(
      new Channel({ title, description, tags, metadata: JSON.stringify(metadata), owner: user.id }),
    );

    await DataStore.save(new UserChannel({ user, channel }));

    router.push(`/media/?channel=${channel.id}`);
  }, [title, description, tags, metadata, user]);

  return (
    <Layout>
      <Toolbar className={classes.toolbar} disableGutters>
        <Typography component="h1" gutterBottom variant="h4">
          Add new channel
        </Typography>
        <div className={classes.grow} />
      </Toolbar>
      <Paper>
        <Container className={classes.container}>
          <form>
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
            <Button color="primary" onClick={onAddNewChannel} variant="contained">
              Save
            </Button>
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
    return { redirect: { destination: '/auth/?redirect=/new/channel', permanent: false } };
  }
};

export default AddChannelPage;
