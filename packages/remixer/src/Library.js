import React from 'react';

import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

import { LibraryTopbar } from './components';

const PREFIX = 'Library';
const classes = {
  title: `${PREFIX}-title`,
};
const Root = styled('div')(({ theme }) => ({
  background: theme.palette.background.paper,
  borderRight: `1px solid ${theme.palette.divider}`,
  [`.${classes.title}`]: {
    marginBottom: theme.spacing(2),
  },
}));
const Media = styled('div')(({ theme }) => ({
  overflow: 'auto',
  padding: theme.spacing(4, 2),
}));
const MediaItem = styled(Card)(({ theme }) => ({
  minHeight: '160px',
}));

export default function Library(props) {
  const { media } = props;

  console.group('Library.js');
  console.log({ media });
  console.groupEnd();

  return (
    <Root className={`RemixerPane RemixerPane--Library`}>
      <LibraryTopbar {...props} />
      <Media className="media">
        <Container maxWidth="sm">
          <Typography variant="h5" className={classes.title}>
            All media
          </Typography>
          <Grid container spacing={3}>
            {media?.length > 0 &&
              media.map(o => (
                <Grid item xs={6} lg={4} key={o.id}>
                  <MediaItem>
                    <Typography noWrap variant="caption">
                      {o.title}
                    </Typography>
                  </MediaItem>
                </Grid>
              ))}
          </Grid>
        </Container>
      </Media>
    </Root>
  );
}
