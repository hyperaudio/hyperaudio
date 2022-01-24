import React from 'react';

import Alert from '@mui/material/Alert';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

import { LibraryTopbar } from './components';
import { Thumb } from '@hyperaudio/common';

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

const GridBlock = props => {
  const { title, items, selectedItems, onThumbClick } = props;
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
                <Thumb
                  img="https://picsum.photos/400/300"
                  isActive={isActive}
                  onClick={!isActive ? () => onThumbClick(o.id) : null}
                  title={o.title}
                />
              </Grid>
            );
          })}
        </Grid>
      </MediaWrapper>
    </MediaBlock>
  );
};

export default function Library(props) {
  const { media, matches, sources, onSourceOpen, onHideLibrary } = props;

  const [searchKey, setSearchKey] = React.useState(null);

  const sourcesIds = sources.map(o => o.id);

  // console.group('Library.js');
  // console.log({ media, matches });
  // console.groupEnd();

  const onThumbClick = id => {
    onSourceOpen(id);
    onHideLibrary();
  };

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
                    onThumbClick={onThumbClick}
                    selectedItems={sourcesIds}
                    title={`${matches?.titles?.length} titles matching: ${searchKey}`}
                  />
                )}
                {matches?.transcripts?.length > 0 && (
                  <GridBlock
                    items={matches.transcripts}
                    onThumbClick={onThumbClick}
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
          <GridBlock items={media} title={`All media`} onThumbClick={onThumbClick} selectedItems={sourcesIds} />
        )}
      </Media>
    </Root>
  );
}

Library.defaultProps = {
  media: null,
};
