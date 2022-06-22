import { createTheme } from '@mui/material/styles';

import components from './components';
import shadows from './shadows';
import { darkPalette, lightPalette } from './palette';
import { getTypography } from './typography';

export const getTheme = options => {
  return createTheme({
    components: components,
    palette: options?.mode === 'dark' ? darkPalette : lightPalette,
    shadows: shadows,
    typography: getTypography(options?.typography),
  });
};

export default getTheme;
