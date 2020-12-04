import Layout from 'src/Layout';
import React from 'react';

import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';

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
}));

export default function AccountPage() {
  const classes = useStyles();

  const [name, setName] = React.useState('');
  const [bio, setBio] = React.useState('');

  const handleSave = () => console.log({ name });

  return (
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
              onBlur={handleSave}
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
              onBlur={handleSave}
              onChange={(e) => setBio(e.target.value)}
              required
              type="text"
              value={bio}
              variant="outlined"
              margin="normal"
            />
          </form>
        </Container>
      </Paper>
    </Layout>
  );
}
