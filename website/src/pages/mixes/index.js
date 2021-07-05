import Layout from 'src/components/Layout';

import Toolbar from '@material-ui/core/Toolbar';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles(theme => ({
  toolbar: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2),
  },
  grow: {
    flexGrow: 1,
  },
}));

const MixesPage = () => {
  const classes = useStyles();

  return (
    <Layout>
      <Container>
        <Toolbar className={classes.toolbar} disableGutters>
          <Typography component="h1" variant="h4">
            All your mixes
          </Typography>
          <div className={classes.grow} />
        </Toolbar>
      </Container>
    </Layout>
  );
};

export default MixesPage;
