import { createTheme } from '@mui/material/styles';
import { deepOrange } from '@mui/material/colors';

const mui = createTheme();

import shadows from './shadows';
import palette from './palette';

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
      styleOverrides: {
        root: {
          borderRadius: mui.spacing(2.5),
        },
      },
    },
    // MuiBreadcrumbs: {
    //   defaultProps: {
    //     separator: '/',
    //   },
    // },
    MuiCard: {
      defaultProps: {
        square: false,
      },
      styleOverrides: {
        root: {
          borderRadius: mui.shape.borderRadius,
          //     padding: mui.spacing(0.15),
          //     [`&.MuiPaper-rounded, & .MuiCardMedia-root, & img`]: {
          //       borderRadius: mui.shape.borderRadius,
          //     },
        },
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
          // [`&.Mui-selected, &.Mui-selected:hover`]: {
          //   backgroundColor: palette.primary.main,
          //   color: palette.primary.contrastText,
          // },
        },
      },
    },
    MuiIconButton: {
      defaultProps: {
        color: 'primary',
      },
      styleOverrides: {
        root: {
          // borderRadius: mui.spacing(0.75),
          borderRadius: 100,
        },
      },
    },
    MuiTablePagination: {
      styleOverrides: {
        actions: {
          marginLeft: mui.spacing(1),
        },
        selectLabel: {
          display: { sx: 'none', lg: 'block' },
        },
        displayedRows: {
          display: 'none',
        },
        selectRoot: {
          marginRight: 0,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: mui.spacing(1),
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          background: palette.primary.dark,
          color: palette.primary.contrastText,
          lineHeight: '1.44em',
        },
      },
    },
  },
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
