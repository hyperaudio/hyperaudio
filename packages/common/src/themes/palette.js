import { createTheme } from '@mui/material/styles';
import { deepOrange, purple, grey } from '@mui/material/colors';

const nmfOrange = {
  900: '#F3650A',
  800: '#F57712',
  700: '#F68117',
  600: '#F78C1B',
  500: '#F8941F',
  400: '#F9A441',
  300: '#FAB462',
  200: '#FCCA8F',
  100: '#FDDFBC',
  50: '#FEF2E4',
  A400: '#F9A441',
};
const nmfPink = {
  900: '#93218E',
  800: '#A2319E',
  700: '#AA39A6',
  600: '#B242AF',
  500: '#B949B6',
  400: '#C464C1',
  300: '#CE80CC',
  200: '#DCA4DB',
  100: '#EAC8E9',
  50: '#F7E9F6',
  A400: '#C464C1',
};
const nmfCyan = {
  900: '#1198B0',
  800: '#1CA6BC',
  700: '#22AEC2',
  600: '#28B7C9',
  500: '#2DBDCE',
  400: '#4DC7D5',
  300: '#6CD1DD',
  200: '#96DEE7',
  100: '#C0EBF0',
  50: '#E6F7F9',
  A400: '#4DC7D5',
};

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
  primary: nmfPink,
  secondary: nmfCyan,
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
  primary: nmfPink,
  secondary: nmfCyan,
};
