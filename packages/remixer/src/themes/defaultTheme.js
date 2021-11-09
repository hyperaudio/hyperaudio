import { createTheme } from '@mui/material/styles';

const mui = createTheme();

const palette = {
  ...mui.palette,
  background: {
    ...mui.palette.background,
    paper: '#fff',
    default: '#F5F5F7',
  },
  divider: '#E9E8EE',
  primary: {
    ...mui.palette.primary,
    main: '#6202EE',
    light: '#6554A5',
    dark: '#190078',
    contrastText: '#fff',
  },
  secondary: {
    ...mui.palette.secondary,
    main: '#207666',
    light: '#2A9B86',
    dark: '#12453C',
    contrastText: '#fff',
  },
  text: {
    ...mui.palette.text,
    // secondary: '#190078',
  },
};

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
    MuiCard: {
      defaultProps: {
        square: false,
      },
      styleOverrides: {
        root: {
          padding: mui.spacing(0.15),
          [`&.MuiPaper-rounded, & .MuiCardMedia-root, & img`]: {
            borderRadius: mui.shape.borderRadius,
          },
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
          borderRadius: mui.spacing(0.75),
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
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          background: palette.primary.dark,
          color: palette.primary.contrastText,
        },
      },
    },
  },
  palette: palette,
  shadows: [
    'none',
    '0px 1px 3px rgba(0,0,0,0.1), 0px 1px 4px rgba(0,0,0,0.08), 0px 1px 12px rgba(0,0,0,0.04)',
    ...mui.shadows,
  ],
  typography: {
    fontFamily: "'Inter', 'Helvetica', 'Arial', sans-serif",
  },
});
