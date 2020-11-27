import Layout from 'src/Layout';

import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  toolbar: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2),
  },
  grow: {
    flexGrow: 1,
  },
}));

export default function AccountPage() {
  const classes = useStyles();

  return (
    <Layout>
      <Toolbar className={classes.toolbar} disableGutters>
        <Typography component="h1" gutterBottom variant="h4">
          Your account
        </Typography>
        <div className={classes.grow} />
      </Toolbar>
      <Paper>Hello</Paper>
    </Layout>
  );
}
