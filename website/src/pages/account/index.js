import React, { useState, useCallback, useEffect } from 'react';
import { withSSRContext } from 'aws-amplify';
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';
import { useRouter } from 'next/router';
import produce from 'immer';

import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Button from '@material-ui/core/Button';

import Layout from 'src/components/Layout';
import { wash, getUser, setUser as saveUser } from 'src/api';
import User from 'src/api/models/User';

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

  const [user, setUser] = useState(() => new User(initialData.user));
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');

  useEffect(() => {
    if (!user) return;
    console.log(user);

    setUsername(user.username);
    setDisplayName(user.name);
    setBio(user.bio);
  }, [user]);

  useEffect(() => {
    onAuthUIStateChange((authState, authData) => {
      console.log({ authState, authData });
      if (authState !== AuthState.SignedIn || !authData) router.push('/auth/?redirect=/account');
    });
  }, [router]);

  const handleSave = useCallback(async () => {
    const nextUserState = produce(user, draftUser => {
      draftUser.bio = bio;
      draftUser.name = displayName;
      draftUser.username = username;
    });

    setUser(await saveUser(nextUserState));
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

    const user = wash(await getUser(sub));

    return { props: { user } };
  } catch (error) {
    console.error(error);
    return { redirect: { destination: '/auth/?redirect=/account', permanent: false } };
  }
};

export default AccountPage;
