import { createTheme } from '@mui/material/styles';

const mui = createTheme();

const palette = {
  ...mui.palette,
  background: {
    ...mui.palette.background,
    default: '#F5F5F7',
    paper: '#fff',
  },
  divider: 'rgba(0,0,0,0.085)',
  primary: {
    ...mui.palette.primary,
    contrastText: '#fff',
    dark: '#190078',
    light: '#6554A5',
    main: '#6202EE',
    offwhite: '#E2D1FD',
  },
  secondary: {
    ...mui.palette.secondary,
    contrastText: '#fff',
    dark: '#12453C',
    light: '#2A9B86',
    main: '#207666',
    offwhite: '#D7E6E2',
  },
  text: {
    ...mui.palette.text,
    // secondary: '#190078',
    primary: '#000',
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
        disableRipple: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 100,
          padding: mui.spacing(0.5, 0.75),
        },
      },
    },
    MuiBreadcrumbs: {
      defaultProps: {
        separator: '›',
      },
    },
    MuiCard: {
      defaultProps: {
        square: false,
      },
      styleOverrides: {
        root: {
          borderRadius: mui.shape.borderRadius,
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
          // borderRadius: mui.spacing(0.75),
          borderRadius: 100,
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
          padding: mui.spacing(0, 1),
        },
      },
    },
  },
  palette: palette,
  shadows: [
    'none',
    '0px 1px 2px rgba(0,0,0,0.1), 0px 1px 3px rgba(0,0,0,0.08), 0px 1px 6px rgba(0,0,0,0.04)',
    '0px 1px 3px rgba(0,0,0,0.1), 0px 1px 4px rgba(0,0,0,0.08), 0px 1px 12px rgba(0,0,0,0.04)',
    ...mui.shadows,
  ],
  typography: {
    fontFamily: "'Inter', 'Helvetica', 'Arial', sans-serif",
    button: {
      fontFamily: 'Nunito, sans-serif',
    },
    body1: {
      lineHeight: '1.7em',
    },
  },
});
