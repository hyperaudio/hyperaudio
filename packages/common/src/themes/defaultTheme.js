import { createTheme } from '@mui/material/styles';
import { deepOrange } from '@mui/material/colors';

const mui = createTheme();

const palette = {
  ...mui.palette,
  background: {
    ...mui.palette.background,
    default: '#F5F5F7',
    paper: '#fff',
  },
  divider: 'rgba(0,0,0,0.088)',
  primary: {
    ...mui.palette.primary,
    dark: '#02007F',
    light: '#CAABF4',
    main: '#6000DE',
  },
  secondary: {
    ...mui.palette.secondary,
    contrastText: '#fff',
    dark: deepOrange[900],
    light: deepOrange[50],
    main: deepOrange[500],
  },
  text: {
    ...mui.palette.text,
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
      },
      styleOverrides: {
        root: {},
        // borderRadius: 100, TODO: find a way to use rounded buttons
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
  shadows: [
    'none',
    '0px 1px 2px rgba(0,0,0,0.1), 0px 1px 3px rgba(0,0,0,0.08), 0px 1px 6px rgba(0,0,0,0.04)',
    '0px 1px 3px rgba(0,0,0,0.1), 0px 1px 4px rgba(0,0,0,0.08), 0px 1px 12px rgba(0,0,0,0.04)',
    ...mui.shadows,
  ],
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
