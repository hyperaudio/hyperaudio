import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = size =>
  makeStyles(theme => ({
    root: {
      background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%);`,
      color: theme.palette.primary.contrastText,
      paddingBottom: theme.spacing(size === 'small' ? 1 : 10),
      paddingTop: theme.spacing(size === 'small' ? 1 : 10),
      textAlign: 'center',
    },
    title: {
      display: size === 'small' ? 'none' : 'block',
    },
  }));

export default function Hero({ org, size }) {
  const classes = useStyles(size)();
  return (
    <div className={classes.root}>
      <Container>
        <Typography className={classes.title} component="h1" variant="h2">
          {org.meta.name}
        </Typography>
      </Container>
    </div>
  );
}
