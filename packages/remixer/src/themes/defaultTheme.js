import { createTheme } from '@mui/material/styles';

const mui = createTheme();

export const defaultTheme = createTheme({
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          [`&.Mui-selected`]: {
            backgroundColor: mui.palette.action.hover,
            [`&:hover`]: {
              backgroundColor: mui.palette.action.hover,
            },
          },
        },
      },
    },
    MuiIconButton: {
      defaultProps: {
        color: 'primary',
      },
      styleOverrides: {
        root: {
          borderRadius: mui.spacing(1),
        },
      },
    },
  },
  palette: {
    background: {
      paper: '#fff',
      default: '#F8F8F8',
    },
    divider: '#E9E8EE',
    primary: {
      main: '#6202EE',
      light: '#F2E7FE',
      dark: '#190078',
    },
    secondary: {
      main: '#01A39D',
      light: '#86FFEA',
      dark: '#002F33',
    },
  },
});
