import React, { useState, useEffect, useCallback } from 'react';
import _ from 'lodash';

import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

const PREFIX = 'InsertSlide';
const classes = {
  head: `${PREFIX}-head`,
  title: `${PREFIX}-title`,
  breadcrumbs: `${PREFIX}-breadcrumbs`,
  canvas: `${PREFIX}-canvas`,
  currentSlide: `${PREFIX}-currentSlide`,
};

const Root = styled('div', {
  shouldForwardProp: prop => prop !== 'editable',
})(({ theme, editable }) => ({
  background: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1),
  [`& .${classes.head}`]: {
    marginBottom: theme.spacing(1),
  },
  [`& .${classes.title}`]: {
    display: 'flex',
    marginBottom: theme.spacing(1),
    alignItems: 'center',
  },
  [`& .${classes.breadcrumbs}`]: {
    ...theme.typography.caption,
  },
  [`& .${classes.canvas}`]: {
    maxHeight: editable ? '240px' : 'auto',
    overflowY: 'auto',
  },
  [`& .${classes.currentSlide}`]: {
    // outline: `5px solid ${theme.palette.primary.main}`,
  },
}));

const Progress = ({ currentSlideId, deck, step, setStep }) => {
  const slide = _.findIndex(deck.deck.slides, o => o.id === currentSlideId) + 1;
  const breadcrumbProps = {
    display: 'block',
    noWrap: true,
    variant: 'caption',
  };
  return (
    <Breadcrumbs className={classes.breadcrumbs}>
      <Link
        {...breadcrumbProps}
        color={step === 0 ? 'textSecondary' : 'primary'}
        onClick={setStep(0)}
        sx={step > 0 && { cursor: 'pointer' }}
        underline={step > 0 ? 'hover' : 'none'}
      >
        {step === 0 ? 'Choose slidedeck:' : 'Decks'}
      </Link>
      {step > 0 && (
        <Link
          {...breadcrumbProps}
          color={step === 1 ? 'textSecondary' : 'primary'}
          onClick={step > 1 && setStep(1)}
          style={{ maxWidth: '150px' }}
          sx={step > 1 && { cursor: 'pointer' }}
          underline={step > 1 ? 'hover' : 'none'}
        >
          {deck.title}
        </Link>
      )}
      {step === 2 && <Typography {...breadcrumbProps}>Slide {slide}</Typography>}
    </Breadcrumbs>
  );
};
const Decks = ({ currentId, decks, onClick }) => {
  return (
    <div className={classes.canvas}>
      <List disablePadding>
        {decks.map((o, i) => (
          <ListItem button divider key={o.id} onClick={onClick(o.id)} selected={o.id === currentId}>
            <ListItemAvatar>
              <Avatar alt={`Avatar n°${i + 1}`} src={o.deck.url} sx={{ width: 32, height: 24 }} variant="rounded" />
            </ListItemAvatar>
            <ListItemText primary={o.title} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};
const Slides = ({ slides, current, onClick }) => {
  return (
    <div className={classes.canvas}>
      <Grid container spacing={{ xs: 1 }} columns={{ xs: 2, sm: 3, md: 4, lg: 5, xl: 6 }}>
        {slides.map((slide, i) => (
          <Grid key={slide.id} item xs={1}>
            <Card className={current === slide.id && classes.currentSlide}>
              <CardActionArea onClick={onClick(slide.id)}>
                <CardMedia component="img" image={slide.url} alt={`Slide ${i + 1}`} />
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};
const Slide = ({ deck, currentSlideId: slideId }) => {
  const slide = _.find(deck.deck.slides, o => o.id === slideId);
  const slideIndex = _.findIndex(deck.deck.slides, o => o.id === slideId);
  const alt = `${deck.title} / Slide ${slideIndex + 1}`;
  const src = slide?.url;
  return (
    <div
      className={classes.canvas}
      style={{
        lineHeight: 0,
      }}
    >
      <img style={{ width: '100%' }} alt={alt} src={src} />
    </div>
  );
};

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

  const onDeckClick = id => () => {
    setStateDeckId(id);
    setStep(1);
  };
  const onSlideClick = id => () => {
    setStateSlideId(id);
    setStep(2);
  };

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

  const stateDeck = _.find(decks, o => o.id === stateDeckId);

  return (
    <Root editable={editable}>
      {editable && (
        <div className={classes.head}>
          <Typography className={classes.title} variant="subtitle2" component="h2" color="primary">
            <SlideshowIcon fontSize="small" sx={{ mr: 0.5 }} color="primary" />
            Slide
          </Typography>
          {editable && (
            <Progress
              currentSlideId={stateSlideId}
              deck={stateDeck}
              setStep={step => () => setStep(step)}
              step={step}
            />
          )}
        </div>
      )}
      {decks.length > 0 ? (
        <>
          {editable && (
            <>
              {step === 0 && <Decks decks={decks} currentId={stateDeckId} onClick={onDeckClick} />}
              {step === 1 && <Slides current={stateSlideId} slides={stateDeck.deck.slides} onClick={onSlideClick} />}
              {step === 2 && <Slide decks={decks} deck={stateDeck} currentSlideId={stateSlideId} />}
            </>
          )}
        </>
      ) : (
        <Alert severity="info">We couldn’t find any decks associated to your transcript sources.</Alert>
      )}
    </Root>
  );
};

InsertSlide.defaultProps = {
  decks: [],
};
