import React, { useState, useEffect, useCallback } from 'react';
import _ from 'lodash';

import Alert from '@mui/material/Alert';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Masonry from '@mui/lab/Masonry';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

import { Thumb } from '@hyperaudio/common';

const PREFIX = 'InsertSlide';
const classes = {
  canvas: `${PREFIX}-canvas`,
  breadcrumbs: `${PREFIX}-breadcrumbs`,
  masonry: `${PREFIX}-masonry`,
  title: `${PREFIX}-title`,
};

const Root = styled('div', {
  shouldForwardProp: prop => prop !== 'editable',
})(({ theme, editable }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
  [`& .${classes.title}`]: {
    marginBottom: theme.spacing(1),
    padding: theme.spacing(1.35, 1, 0),
  },
  [`& .${classes.breadcrumbs}`]: {
    padding: theme.spacing(0, 1),
    marginBottom: theme.spacing(1 * -1),
    marginTop: theme.spacing(1 * -1),
  },
  [`& .${classes.canvas}`]: {
    lineHeight: 1,
    maxHeight: editable ? '220px' : 'auto',
    overflowY: 'auto',
    padding: theme.spacing(1.35),
  },
  [`& .${classes.masonry}`]: {
    alignContent: 'flex-start',
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

  const [stateDeckId, setStateDeckId] = useState(deck);
  const [stateSlideId, setStateSlideId] = useState(slide);
  const [step, setStep] = useState();

  const decks = _.filter(sources, o => o.deck !== null);

  useEffect(() => {
    onChooseSlide({ deck: stateDeckId, slide: stateSlideId });
  }, [stateSlideId]);

  useEffect(() => {
    let i;
    if (deck !== null) {
      if (slide !== null) {
        i = 2;
      } else {
        i = 1;
      }
    } else {
      i = 0;
    }
    setStep(i);
  }, [deck, slide]);

  // useEffect(() => {
  //   if (!stateDeckId && decks.length === 1) {
  //     setStateDeckId(decks[0].id);
  //   }
  // }, [stateDeckId, decks]);

  const onDeckClick = id => {
    setStateDeckId(id);
    setStep(1);
  };
  const onSlideClick = id => {
    setStateSlideId(id);
    setStep(2);
  };

  const breadcrumbProps = {
    noWrap: true,
    variant: 'caption',
  };
  const masonryProps = {
    className: classes.masonry,
    columns: { xs: 2, sm: 4 },
    defaultColumns: 4,
    defaultHeight: 60,
    defaultSpacing: 2,
    spacing: 2,
  };

  console.log({ deck, slide, step });

  return (
    <Root editable={editable}>
      {editable && (
        <Typography className={classes.title} variant="subtitle2" component="h2" color="primary">
          <SlideshowIcon fontSize="small" sx={{ marginRight: '6px' }} />
          <span id="insert-title">Slide</span>
        </Typography>
      )}
      {decks?.length > 0 ? (
        [
          editable && (
            <Breadcrumbs className={classes.breadcrumbs}>
              <Link
                {...breadcrumbProps}
                color={step === 0 ? 'textSecondary' : 'primary'}
                href={step > 0 ? '' : null}
                onClick={() => setStep(0)}
                underline={step > 0 ? 'hover' : 'none'}
              >
                Available decks
              </Link>
              {[1, 2].includes(step) && stateDeckId && (
                <Link
                  {...breadcrumbProps}
                  color={step === 1 ? 'textSecondary' : 'primary'}
                  href={step > 1 ? '' : null}
                  onClick={step > 1 ? () => setStep(1) : null}
                  sx={{ maxWidth: '160px' }}
                  underline={step > 1 ? 'hover' : 'none'}
                >
                  {_.find(decks, o => o.id === stateDeckId)?.title}
                </Link>
              )}
              {step === 2 && <Typography {...breadcrumbProps}>Slide {stateSlideId + 1}</Typography>}
            </Breadcrumbs>
          ),
          <div className={classes.canvas}>
            {step === 0 && (
              <Masonry {...masonryProps}>
                {decks.length > 1 &&
                  decks.map(o => (
                    <Thumb
                      img={o.deck.url}
                      isActive={o.id === stateDeckId}
                      key={o.id}
                      onClick={() => onDeckClick(o.id)}
                      title={o.title}
                    />
                  ))}
              </Masonry>
            )}
            {step === 1 && (
              <Masonry {...masonryProps}>
                {stateDeckId &&
                  _.find(decks, o => o.id === stateDeckId)?.deck?.slides?.map((o, i) => {
                    return (
                      <Thumb
                        img={o.url}
                        isActive={deck === stateDeckId && o.id === stateSlideId}
                        key={o.id}
                        onClick={() => onSlideClick(o.id)}
                        title={i + 1}
                      />
                    );
                  })}
              </Masonry>
            )}
            {step === 2 && (
              <img
                style={{ width: '100%' }}
                alt={`${_.find(decks, o => o.id === stateDeckId).title} › Slide ${_.findIndex(
                  _.find(decks, o => o.id === stateDeckId).deck.slides,
                  o => o.id === stateSlideId,
                )}`}
                src={_.find(_.find(decks, o => o.id === stateDeckId).deck.slides, o => o.id === stateSlideId).url}
              />
            )}
          </div>,
        ]
      ) : (
        <Alert severity="info">We couldn’t find any decks associated to your transcript sources.</Alert>
      )}
    </Root>
  );
};

InsertSlide.defaultProps = {
  decks: [],
};
