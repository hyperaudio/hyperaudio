import { createTheme } from '@mui/material/styles';

import shadows from './shadows';
import palette from './palette';
import components from './components';

export const defaultTheme = createTheme({
  components: components,
  palette: palette,
  shadows: shadows,
  typography: {
    fontFamily: "'Inter', 'Helvetica', 'Arial', sans-serif",
    h1: {
      fontFamily: 'Quicksand, sans-serif',
    },
    h2: {
      fontFamily: 'Quicksand, sans-serif',
    },
    h3: {
      fontFamily: 'Quicksand, sans-serif',
      fontSize: '2.55rem',
      fontWeight: '700',
    },
    h4: {
      fontFamily: 'Quicksand, sans-serif',
      fontWeight: '700',
    },
    h5: {
      fontFamily: 'Quicksand, sans-serif',
      fontWeight: '700',
      fontSize: '1.88rem',
    },
    h6: {
      fontFamily: 'Quicksand, sans-serif',
      fontSize: '1.55rem',
      fontWeight: '700',
    },
    body1: {
      lineHeight: '1.66em',
    },
    body2: {
      lineHeight: '1.66em',
    },
    caption: {
      letterSpacing: 'normal',
    },
    button: {
      fontFamily: 'Quicksand, sans-serif',
      fontWeight: '700',
      letterSpacing: '0.066em',
    },
  },
});
