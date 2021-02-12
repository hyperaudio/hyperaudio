import { createMuiTheme } from '@material-ui/core/styles';

export default function fluid(prop, range) {
  const { min, max } = range;
  const { values, up } = createMuiTheme().breakpoints;
  const canvas = { min: values.xs, max: values.xl };
  const minVal = parseInt(min, 10);
  const maxVal = parseInt(max, 10);
  return {
    [prop]: min,
    [up('xs')]: {
      [prop]: `calc(${min} + ${maxVal - minVal} * (100vw - ${canvas.min}px) / ${canvas.max - canvas.min})`,
    },
    [up('xl')]: {
      [prop]: max,
    },
  };
}
