import { createTheme } from '@mui/material/styles';
import { red, deepPurple, grey } from '@mui/material/colors';

const mui = createTheme();

export const lightPalette = {
  ...mui.palette,
  mode: 'light',
  background: {
    ...mui.palette.background,
    default: '#F5F5F7',
    paper: '#fff',
  },
  text: {
    primary: grey[900],
    secondary: grey[700],
    disabled: grey[600],
  },
  divider: 'rgba(0,0,0,0.088)',
  primary: deepPurple,
  secondary: red,
};

export const darkPalette = {
  ...mui.palette,
  mode: 'dark',
  background: {
    ...mui.palette.background,
    default: '#1c1c1c',
    paper: '#363636',
  },
  text: {
    primary: grey[100],
    secondary: grey[200],
    disabled: grey[300],
  },
  divider: 'rgba(255,255,255,0.088)',
  primary: deepPurple,
  secondary: red,
};
