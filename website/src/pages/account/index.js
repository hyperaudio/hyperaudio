import React, { useState, useCallback, useEffect } from 'react';
import { withSSRContext, DataStore } from 'aws-amplify';
import { serializeModel, deserializeModel } from '@aws-amplify/datastore/ssr';
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';
import { useRouter } from 'next/router';

import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Button from '@material-ui/core/Button';

import Layout from 'src/Layout';
import { User } from 'src/models';

// const getUser = async (setUser, id) => {
//   const user = await DataStore.query(User, id);
//   if (!Array.isArray(user)) setUser(user);
// };

const useStyles = makeStyles(theme => ({
  toolbar: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2),
  },
  grow: {
    flexGrow: 1,
  },
  divider: {
    marginBottom: theme.spacing(3),
    marginTop: theme.spacing(3),
  },
}));

const AccountPage = initialData => {
  const classes = useStyles();
  const router = useRouter();

  const [bio, setBio] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [name, setName] = useState('');
  const [user, setUser] = useState(initialData.user ? deserializeModel(User, initialData.user) : null);

  // useEffect(() => {
  //   Auth.currentAuthenticatedUser()
  //     .then(user => {
  //       console.log(user);
  //       getUser(setUser, user.attributes.sub);
  //     })
  //     .catch(() => setUser(null));
  // }, [setUser]);

  useEffect(() => {
    onAuthUIStateChange((authState, authData) => {
      console.log({ authState, authData });
      if (authState !== AuthState.SignedIn || !authData) router.push('/auth/?redirect=/account');
    });
  }, [router]);

  useEffect(() => {
    if (!user) return;
    setBio(user.bio);
    setDisplayName(user.displayName);
    setName(user.name);
  }, [user]);

  console.log({ user });

  const handleSave = useCallback(async () => {
    setUser(
      await DataStore.save(
        User.copyOf(user, updated => {
          updated.bio = bio;
          updated.displayName = displayName;
          updated.name = name;
        }),
      ),
    );
  }, [name, bio, user]);

  return (
    <Layout>
      <Toolbar className={classes.toolbar} disableGutters>
        <Typography component="h1" variant="h4">
          Your account
        </Typography>
        <div className={classes.grow} />
      </Toolbar>
      <Container disableGutters>
        <form>
          <TextField
            fullWidth
            label="Name"
            margin="normal"
            onChange={e => setName(e.target.value)}
            required
            type="text"
            value={name}
          />
          <TextField
            fullWidth
            label="Display name"
            margin="normal"
            onChange={e => setDisplayName(e.target.value)}
            required
            type="text"
            value={displayName}
          />
          <TextField
            fullWidth
            helperText=""
            label="Bio"
            margin="normal"
            multiline
            onChange={e => setBio(e.target.value)}
            required
            type="text"
            value={bio}
          />
          <div className={classes.divider} />
          <Button
            color="primary"
            disabled={user.bio === bio && user.displayName === displayName && user.name === name}
            onClick={handleSave}
            variant="contained"
          >
            Save
          </Button>
        </form>
      </Container>
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

    return { props: { user } };
  } catch (error) {
    return { redirect: { destination: '/auth/?redirect=/account', permanent: false } };
  }
};

export default AccountPage;
