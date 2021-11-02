import React from 'react';

import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';

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
}));
const MediaBlock = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
}));

const MediaWrapper = styled(Container)(({ theme }) => ({
  margin: theme.spacing(4, 0, 4),
}));
const MediaItem = styled(Card)(({ theme }) => ({
  transition: `background ${theme.transitions.duration.complex}`,
  [`&:hover`]: {
    background: theme.palette.primary.main,
    boxShadow: `0 0px 0px 5px ${theme.palette.primary.main}`,
    color: theme.palette.primary.contrastText,
  },
}));
const CardTitle = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(0.5, 0),
}));

export default function Library(props) {
  const { media, matches, onSourceOpen } = props;

  console.group('Library.js');
  console.log({ media, matches });
  console.groupEnd();

  return (
    <Root className={`RemixerPane RemixerPane--Library`}>
      <LibraryTopbar {...props} />
      <Media>
        {matches?.length > 0 && (
          <>
            <MediaBlock>
              <MediaWrapper maxWidth="sm">
                <Typography component="h2" variant="h5" className={classes.title}>
                  Search results
                </Typography>
                <Grid container spacing={3}>
                  {media.map(o => (
                    <Grid item xs={6} lg={4} key={o.id}>
                      <MediaItem elevation={0} onClick={() => onSourceOpen(o.id)}>
                        <CardMedia
                          component="img"
                          height="140"
                          image="https://picsum.photos/200/300"
                          alt="green iguana"
                        />
                        <Tooltip enterDelay={1500} title={o.title}>
                          <CardTitle display="block" noWrap variant="caption">
                            {o.title}
                          </CardTitle>
                        </Tooltip>
                      </MediaItem>
                    </Grid>
                  ))}
                </Grid>
              </MediaWrapper>
            </MediaBlock>
            <Divider />
          </>
        )}
        {media?.length > 0 && (
          <MediaBlock>
            <MediaWrapper maxWidth="sm">
              <Typography component="h2" variant="h5" className={classes.title}>
                All media
              </Typography>
              <Grid container spacing={3}>
                {media.map(o => (
                  <Grid item xs={6} lg={4} key={o.id}>
                    <MediaItem elevation={0} onClick={() => onSourceOpen(o.id)}>
                      <CardMedia
                        component="img"
                        height="140"
                        image="https://picsum.photos/200/300"
                        alt={`Media poster from ${o.title}`}
                      />
                      <Tooltip enterDelay={1500} title={o.title}>
                        <CardTitle display="block" noWrap variant="caption">
                          {o.title}
                        </CardTitle>
                      </Tooltip>
                    </MediaItem>
                  </Grid>
                ))}
              </Grid>
            </MediaWrapper>
          </MediaBlock>
        )}
      </Media>
    </Root>
  );
}

Library.defaultProps = {
  media: null,
};
