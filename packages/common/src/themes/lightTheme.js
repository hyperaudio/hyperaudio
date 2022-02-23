import { createTheme } from '@mui/material/styles';

import shadows from './shadows';
import palette from './palette';
import components from './components';
import typography from './typography';

export const lightTheme = createTheme({
  components: components,
  palette: palette,
  shadows: shadows,
  typography: typography,
});
