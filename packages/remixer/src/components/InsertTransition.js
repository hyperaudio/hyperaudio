import React, { useState, useCallback, useEffect } from 'react';

import MovieFilterIcon from '@mui/icons-material/MovieFilter';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

const PREFIX = 'InsertTransition';
const classes = {
  controls: `${PREFIX}-controls`,
  slider: `${PREFIX}-slider`,
  title: `${PREFIX}-title`,
};

const Root = styled('div')(({ theme }) => ({
  padding: theme.spacing(1.35, 1),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
  [`& .${classes.title}`]: {
    marginBottom: theme.spacing(1),
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
    <Root>
      <Typography variant="subtitle2" component="h2" color="primary" className={classes.title}>
        <MovieFilterIcon fontSize="small" sx={{ marginRight: '6px' }} />
        <span id="insert-slide-title">Transition</span>
      </Typography>
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
