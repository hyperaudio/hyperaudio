import React, { useState, useEffect, useCallback } from 'react';
import _ from 'lodash';

import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Masonry from '@mui/lab/Masonry';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

import { Thumb } from '.';

const PREFIX = 'InsertSlide';
const classes = {
  canvas: `${PREFIX}-canvas`,
  gridItem: `${PREFIX}-gridItem`,
  alert: `${PREFIX}-alert`,
  masonry: `${PREFIX}-masonry`,
  breadcrumbs: `${PREFIX}-breadcrumbs`,
  title: `${PREFIX}-title`,
};

const Root = styled(Paper, {
  shouldForwardProp: prop => prop !== 'fullSize',
})(({ theme, fullSize }) => ({
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1, 2, 0.5),
  [`& .${classes.title}`]: {
    marginBottom: theme.spacing(1),
  },
  [`& .${classes.canvas}`]: {
    margin: theme.spacing(1 * -1, 1 * -1, 2),
    maxHeight: '220px',
    overflowY: 'auto',
    padding: theme.spacing(1, 1, 0),
  },
  [`& .${classes.breadcrumbs}`]: {
    marginBottom: theme.spacing(1),
  },
  [`& .${classes.masonry}`]: {
    alignContent: 'flex-start',
  },
  [`& .${classes.alert}`]: {
    margin: theme.spacing(1, 0, 2),
  },
}));

export const InsertSlide = props => {
  const {
    editable = false,
    sources,
    block: { key, deck, slide },
    dispatch,
  } = props;

  const onChooseSlide = useCallback(
    ({ deck, slide }) => dispatch && dispatch({ type: 'slidesChange', key, deck, slide }),
    [],
  );

  const [stateDeck, setStateDeck] = useState(deck);
  const [stateSlide, setStateSlide] = useState(slide);

  const decks = _.filter(sources, o => o.deck !== null);

  useEffect(() => {
    onChooseSlide({ deck: stateDeck, slide: stateSlide });
  }, [stateDeck, stateSlide]);

  useEffect(() => {
    if (!stateDeck && decks.length === 1) {
      setStateDeck(decks[0].id);
    }
  }, [stateDeck, decks]);

  return (
    <Root>
      <Typography className={classes.title} variant="subtitle2" component="h2" color="primary">
        <SlideshowIcon fontSize="small" sx={{ marginRight: '6px' }} />
        <span id="insert-title">Slide</span>
      </Typography>
      {decks && decks.length > 0 ? (
        <>
          <Breadcrumbs className={classes.breadcrumbs}>
            <Link
              color={stateDeck ? 'primary' : 'textSecondary'}
              disabled={!stateDeck}
              href={stateDeck ? '' : null}
              onClick={() => setStateDeck(null)}
              underline={stateDeck !== null && stateDeck !== deck ? 'hover' : 'none'}
              variant="caption"
            >
              Available decks
            </Link>
            {stateDeck && <Typography variant="caption">{_.find(decks, o => o.id === stateDeck)?.title}</Typography>}
          </Breadcrumbs>
          <div className={classes.canvas}>
            <Masonry
              columns={{ xs: 2, sm: 4, md: 6, lg: 8, xl: 10 }}
              defaultColumns={8}
              defaultHeight={60}
              defaultSpacing={2}
              spacing={2}
              className={classes.masonry}
            >
              {!stateDeck &&
                decks.length > 1 &&
                decks.map(o => {
                  if (!o.deck) return null;
                  return (
                    <Thumb
                      key={o.id}
                      title={o.title}
                      img={o.deck.url}
                      onClick={() => setStateDeck(o.id)}
                      isActive={o.id === stateDeck}
                    />
                  );
                })}
              {stateDeck &&
                _.find(decks, o => o.id === stateDeck)?.deck?.slides?.map((o, i) => {
                  return (
                    <Thumb
                      key={o.id}
                      img={o.url}
                      isActive={stateDeck === deck && o.id === stateSlide}
                      onClick={() => setStateSlide(o.id)}
                      title={i + 1}
                    />
                  );
                })}
            </Masonry>
          </div>
        </>
      ) : (
        <Alert className={classes.alert} severity="warning">
          None of the available remix sources has associated slideshows.
        </Alert>
      )}
    </Root>
  );
};

InsertSlide.defaultProps = {
  decks: [],
};
