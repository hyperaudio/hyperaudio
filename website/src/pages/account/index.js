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
  container: {
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
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

  const [user, setUser] = useState(initialData.user ? deserializeModel(User, initialData.user) : null);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');

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
    setName(user.name);
    setBio(user.bio);
  }, [user]);

  console.log({ user });

  const handleSave = useCallback(async () => {
    setUser(
      await DataStore.save(
        User.copyOf(user, updated => {
          updated.name = name;
          updated.bio = bio;
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
      <Paper>
        <Container className={classes.container}>
          <form>
            <TextField
              fullWidth
              helperText=""
              label="Name"
              onChange={e => setName(e.target.value)}
              required
              type="text"
              value={name}
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              multiline
              helperText=""
              label="Bio"
              onChange={e => setBio(e.target.value)}
              required
              type="text"
              value={bio}
              variant="outlined"
              margin="normal"
            />
            <div className={classes.divider} />
            <Button color="primary" onClick={handleSave} variant="contained">
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

    return { props: { user } };
  } catch (error) {
    return { redirect: { destination: '/auth/?redirect=/account', permanent: false } };
  }
};

export default AccountPage;
