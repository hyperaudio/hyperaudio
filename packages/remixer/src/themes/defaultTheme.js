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
    MuiDialog: {
      styleOverrides: {
        paper: {
          padding: mui.spacing(2),
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          padding: mui.spacing(3),
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: mui.spacing(3, 3),
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: mui.spacing(3),
        },
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
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: '14px',
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
  typography: {
    fontFamily: "'Inter', 'Helvetica', 'Arial', sans-serif",
  },
});
