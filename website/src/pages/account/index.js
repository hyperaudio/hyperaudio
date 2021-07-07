import React, { useState, useCallback, useEffect } from 'react';
import { withSSRContext } from 'aws-amplify';
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';
import { useRouter } from 'next/router';
import axios from 'axios';

import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Button from '@material-ui/core/Button';

import Layout from 'src/components/Layout';
import { getItem } from 'src/util/api';

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

const saveUser = user => axios.put(`/api/v2/users/${user.pk}`, user);

const AccountPage = initialData => {
  const classes = useStyles();
  const router = useRouter();

  const [user, setUser] = useState(initialData.user ?? null);
  const [username, setUsername] = useState(initialData.user.username ?? '');
  const [displayName, setDisplayName] = useState(initialData.user.name ?? '');
  const [bio, setBio] = useState(initialData.user.bio ?? '');

  // TODO test this:
  useEffect(() => {
    onAuthUIStateChange((authState, authData) => {
      console.log({ authState, authData });
      if (authState !== AuthState.SignedIn || !authData) router.push('/auth/?redirect=/account');
    });
  }, [router]);

  console.log({ user });

  const handleSave = useCallback(async () => {
    user.bio = bio;
    user.name = displayName;
    user.username = username;
    await saveUser(user);
    // setUser(
    //   await DataStore.save(
    //     User.copyOf(user, updated => {
    //       updated.bio = bio;
    //       updated.name = displayName;
    //       updated.username = username;
    //     }),
    //   ),
    // );
  }, [user, username, displayName, bio]);

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
            label="Username"
            margin="normal"
            onChange={e => setUsername(e.target.value)}
            required
            type="text"
            value={username}
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
  const { Auth } = withSSRContext(context);

  try {
    const {
      attributes: { sub },
    } = await Auth.currentAuthenticatedUser();

    const { Item: user } = await getItem(sub, 'v0_metadata');

    return { props: { user } };
  } catch (error) {
    return { redirect: { destination: '/auth/?redirect=/account', permanent: false } };
  }
};

export default AccountPage;
