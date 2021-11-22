import React, { useState, useCallback, useEffect } from 'react';

import MovieFilterIcon from '@mui/icons-material/MovieFilter';
import Paper from '@mui/material/Paper';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

const PREFIX = 'InsertTransition';
const classes = {
  controls: `${PREFIX}-controls`,
  slider: `${PREFIX}-slider`,
  title: `${PREFIX}-title`,
};

const Root = styled(Paper)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1, 2, 0.5),
  [`& .${classes.title}`]: {
    marginBottom: theme.spacing(1),
  },
  [`& .${classes.slider}`]: {
    [`& .MuiSlider-markLabel`]: {
      ...theme.typography.caption,
      color: theme.palette.text.secondary,
      top: theme.spacing(3),
    },
  },
}));

export const InsertTransition = ({ block: { key, transition: duration = 3000 }, dispatch }) => {
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
            { value: 1000, label: '1s' },
            { value: 3000, label: '3s' },
            { value: 5000, label: '5s' },
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
