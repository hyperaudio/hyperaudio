import { createTheme } from '@mui/material/styles';
import { deepOrange } from '@mui/material/colors';

const mui = createTheme();

import palette from './palette';

const components = {
  MuiCssBaseline: {
    html: {
      [`& *::selection`]: {
        backgroundColor: deepOrange[500],
      },
    },
  },
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
  MuiCard: {
    defaultProps: {
      square: false,
    },
    styleOverrides: {
      root: {
        borderRadius: mui.shape.borderRadius,
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
  MuiIconButton: {
    defaultProps: {
      color: 'primary',
    },
    styleOverrides: {
      root: {
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
};

export default components;
