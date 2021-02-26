import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';

import { Button } from '@material-ui/core';

const useStyles = size =>
  makeStyles(theme => ({
    root: {
      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%);`,
      color: theme.palette.primary.contrastText,
      paddingBottom: theme.spacing(size === 'small' ? 0.5 : 10),
      paddingTop: theme.spacing(size === 'small' ? 0.5 : 10),
      paddingLeft: theme.spacing(4),
      paddingRight: theme.spacing(4),
      // textAlign: 'center',
    },
    title: {
      display: size === 'small' ? 'none' : 'block',
    },
    text: {
      display: size === 'small' ? 'none' : 'block',
      marginBottom: theme.spacing(2),
      [theme.breakpoints.up('md')]: {
        marginBottom: theme.spacing(4),
        maxWidth: '66%',
      },
    },
    button: {
      display: size === 'small' ? 'none' : 'inline-block',
    },
  }));

export default function Hero({ org, size }) {
  const classes = useStyles(size)();

  return (
    <div className={classes.root}>
      <Container>
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
      </Container>
    </div>
  );
}
