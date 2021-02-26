import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';

import { Button } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%);`,
    color: theme.palette.primary.contrastText,
    padding: theme.spacing(10, 0),
  },
  title: {},
  text: {
    marginBottom: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      marginBottom: theme.spacing(4),
      maxWidth: '66%',
    },
  },
  button: {},
}));

const Hero = ({ org }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Container>
        <Typography className={classes.title} gutterBottom component="h1" variant="h4">
          {org.meta.name}
        </Typography>
        <Typography className={classes.text} gutterBottom component="p" variant="h6">
          {org.meta.text}
        </Typography>
        <Button className={classes.button} href={org.meta.url} color="inherit" variant="outlined">
          Visit {org.meta.name}
        </Button>
      </Container>
    </div>
  );
};

export default Hero;
