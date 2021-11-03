import React from 'react';

import Alert from '@mui/material/Alert';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardActionArea from '@mui/material/CardActionArea';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';
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

const MediaItem = styled(Card, {
  shouldForwardProp: prop => prop !== 'isActive',
})(({ theme, isActive }) => ({
  background: isActive ? theme.palette.primary.main : 'auto',
  boxShadow: `0 0px 0px 5px ${isActive ? theme.palette.primary.main : 'transparent'}`,
  color: isActive ? theme.palette.primary.contrastText : theme.palette.primary.dark,
  transitionDuration: theme.transitions.duration.standard,
  transitionProperty: 'background, background-color, box-shadow, color',
  [`&:hover`]: {
    background: theme.palette.primary.main,
    boxShadow: `0 0px 0px 5px ${theme.palette.primary.main}`,
    color: theme.palette.primary.contrastText,
  },
}));
const CardTitle = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(0.5, 0, 0),
}));

const GridBlock = props => {
  const { title, items, selectedItems, onSourceOpen } = props;
  return (
    <MediaBlock>
      <MediaWrapper maxWidth="sm">
        <Typography component="h2" variant="h6" className={classes.title}>
          {title}
        </Typography>
        <Grid container spacing={3}>
          {items.map(o => {
            const isActive = selectedItems.includes(o.id);
            return (
              <Grid item xs={12} md={6} lg={4} key={o.id}>
                <MediaItem elevation={0} isActive={isActive} onClick={!isActive ? () => onSourceOpen(o.id) : null}>
                  <CardActionArea disabled={isActive}>
                    <CardMedia component="img" height="200" image="https://picsum.photos/200/300" alt="green iguana" />
                    <Tooltip enterDelay={1500} title={o.title}>
                      <CardTitle display="block" noWrap variant="caption">
                        {o.title}
                      </CardTitle>
                    </Tooltip>
                  </CardActionArea>
                </MediaItem>
              </Grid>
            );
          })}
        </Grid>
      </MediaWrapper>
    </MediaBlock>
  );
};

export default function Library(props) {
  const { media, matches, sources, onSourceOpen } = props;

  const [searchKey, setSearchKey] = React.useState(null);

  const sourcesIds = sources.map(o => o.id);

  console.group('Library.js');
  console.log({ media, matches });
  console.groupEnd();

  return (
    <Root className={`RemixerPane RemixerPane--Library`}>
      <LibraryTopbar {...props} setSearchKey={setSearchKey} />
      <Media>
        {searchKey && (
          <>
            {matches?.titles?.length > 0 || matches?.transcripts?.length > 0 ? (
              <>
                {matches?.titles?.length > 0 && (
                  <GridBlock
                    items={matches.titles}
                    onSourceOpen={onSourceOpen}
                    selectedItems={sourcesIds}
                    title={`${matches?.titles?.length} titles matching: ${searchKey}`}
                  />
                )}
                {matches?.transcripts?.length > 0 && (
                  <GridBlock
                    items={matches.transcripts}
                    onSourceOpen={onSourceOpen}
                    selectedItems={sourcesIds}
                    title={`${matches?.transcripts?.length} transcript occurances matching: ${searchKey}`}
                  />
                )}
              </>
            ) : (
              <Alert severity="warning">
                We couldn’t find any media matches for <strong>{searchKey}</strong>
              </Alert>
            )}
            <Divider />
          </>
        )}

        {media?.length > 0 && (
          <GridBlock items={media} title={`All media`} onSourceOpen={onSourceOpen} selectedItems={sourcesIds} />
        )}
      </Media>
    </Root>
  );
}

Library.defaultProps = {
  media: null,
};
