import React, { useState, useCallback, useEffect } from 'react';

import MovieFilterIcon from '@mui/icons-material/MovieFilter';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

const PREFIX = 'InsertTransition';
const classes = {
  root: `${PREFIX}-root`,
  controls: `${PREFIX}-controls`,
  slider: `${PREFIX}-slider`,
  title: `${PREFIX}-title`,
};

const Root = styled('div')(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  padding: theme.spacing(1),
  [`& .${classes.head}`]: {
    marginBottom: theme.spacing(1),
  },
  [`& .${classes.title}`]: {
    display: 'flex',
    marginBottom: theme.spacing(1),
    alignItems: 'center',
  },
  [`& .${classes.controls}`]: {
    padding: theme.spacing(0, 0.5),
    lineHeight: 0,
  },
  [`& .${classes.slider}`]: {
    paddingBottom: theme.spacing(1),
    [`& .MuiSlider-markLabel`]: {
      ...theme.typography.caption,
      color: theme.palette.text.secondary,
      top: theme.spacing(3),
    },
  },
}));

export const InsertTransition = ({ editable = false, block: { key, transition: duration = 3000 }, dispatch }) => {
  const [stateDuration, setStateDuration] = useState(duration);
  useEffect(() => setStateDuration(duration), [duration]);

  const onSliderChange = useCallback((e, value) => setStateDuration(value), []);
  const onDurationChange = useCallback(
    (e, value) => dispatch({ type: 'transitionDurationChange', key, transition: value }),
    [dispatch],
  );

  const labelFormat = useCallback(val => `${(val / 1000).toFixed(1)} s`, []);

  return (
    <Root className={classes.root}>
      <div className={classes.head}>
        <Typography className={classes.title} color="primary" component="h2" variant="body2" sx={{ fontWeight: 500 }}>
          <MovieFilterIcon fontSize="small" sx={{ mr: 0.5 }} color="primary" />
          <span id="insert-slide-title">Transition</span>
        </Typography>
      </div>
      <div className={classes.controls}>
        <Slider
          aria-labelledby="insert-slide-title"
          className={classes.slider}
          marks={[
            { value: 2000, label: '2s' },
            // { value: 3000, label: '3s' },
            { value: 4000, label: '4s' },
          ]}
          max={5000}
          min={1000}
          onChange={onSliderChange}
          onChangeCommitted={onDurationChange}
          size="small"
          value={stateDuration}
          valueLabelDisplay="auto"
          valueLabelFormat={labelFormat}
        />
      </div>
    </Root>
  );
};
