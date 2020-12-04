/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */
import React, { useState, useCallback, useEffect } from 'react';
import { Auth } from 'aws-amplify';
import { DataStore } from '@aws-amplify/datastore';
import {
  AmplifyAuthenticator,
  AmplifySignIn,
  AmplifySignUp,
  // AmplifyConfirmSignUp,
  // AmplifyConfirmSignIn,
  // AmplifyForgotPassword,
  // AmplifyRequireNewPassword,
} from '@aws-amplify/ui-react';

import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Button from '@material-ui/core/Button';

import Layout from 'src/Layout';
import { User } from 'src/models';

const getUser = async (setUser, id) => {
  const user = await DataStore.query(User, id);
  if (!Array.isArray(user)) setUser(user);
};

const useStyles = makeStyles((theme) => ({
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

export default function AccountPage() {
  const classes = useStyles();

  const [user, setUser] = useState();
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then((user) => {
        console.log(user);
        getUser(setUser, user.attributes.sub);
      })
      .catch(() => setUser(null));
  }, [setUser]);

  useEffect(() => {
    if (!user) return;
    setName(user.name);
    setBio(user.bio);
  }, [user]);

  console.log({ user });

  const handleSave = useCallback(async () => {
    await DataStore.save(
      User.copyOf(user, (updated) => {
        updated.name = name;
        updated.bio = bio;
      }),
    );
  }, [name, bio]);

  return (
    <AmplifyAuthenticator>
      <style scoped>
        {`
        :root {
          --amplify-primary-color: #0083e8;
          --amplify-primary-tint: #006ec2;
          --amplify-primary-shade: #006ec2;
        }
        `}
      </style>
      <AmplifySignIn slot="sign-in" usernameAlias="email" />
      <AmplifySignUp slot="sign-up" usernameAlias="email" formFields={[{ type: 'email' }, { type: 'password' }]} />
      <Layout>
        <Toolbar className={classes.toolbar} disableGutters>
          <Typography component="h1" gutterBottom variant="h4">
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
                onChange={(e) => setName(e.target.value)}
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
                onChange={(e) => setBio(e.target.value)}
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
    </AmplifyAuthenticator>
  );
}

// <AmplifyConfirmSignUp slot="confirm-sign-up" usernameAlias="email" />
// <AmplifyConfirmSignIn slot="confirm-sign-in" usernameAlias="email" />
// <AmplifyForgotPassword slot="forgot-password" usernameAlias="email" />
// <AmplifyRequireNewPassword slot="require-new-password" usernameAlias="email" />
