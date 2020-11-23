import NextLink from 'next/link';
import axios from 'axios';
import useSWR from 'swr';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Paper from '@material-ui/core/Paper';
import Skeleton from '@material-ui/lab/Skeleton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';

import Layout from 'src/Layout';

const fetcher = (url) => axios.get(url).then((res) => res.data);

const useStyles = makeStyles((theme) => ({
  toolbar: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2),
  },
  grow: {
    flexGrow: 1,
  },
}));

export default function Dashboard({ initialData }) {
  const classes = useStyles();

  const { data, error } = useSWR('/api/v2/media', fetcher, { initialData });

  if (error) return <h1>Err?</h1>;
  return (
    <Layout>
      <Toolbar className={classes.toolbar} disableGutters>
        <Typography component="h1" gutterBottom variant="h4">
          Your media
        </Typography>
        <div className={classes.grow} />
        <Button variant="contained" color="primary">
          New Media
        </Button>
      </Toolbar>
      <Paper>
        <List dense>
          {data
            ? data.map(({ id, title }) => (
                <NextLink key={id} href={`/media/${id}`}>
                  <ListItem button>
                    <ListItemText
                      primary={title}
                      secondary={'some info'}
                      primaryTypographyProps={{ color: 'primary' }}
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end">
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                </NextLink>
              ))
            : Array.from({ length: 5 }, () => Math.floor(Math.random() * 40)).map((element, i) => {
                return (
                  <ListItem key={`${element}${i}`}>
                    <ListItemText
                      primary={<Skeleton variant="text" width="50%" />}
                      secondary={<Skeleton variant="text" width="20%" />}
                    />
                  </ListItem>
                );
              })}
        </List>
      </Paper>
    </Layout>
  );
}
