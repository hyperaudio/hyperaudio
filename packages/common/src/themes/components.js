import { createTheme } from '@mui/material/styles';
import { deepPurple, grey } from '@mui/material/colors';

import { getTypography } from './typography';

const mui = createTheme();

const components = {
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        [`& > div`]: {
          minHeight: '100%',
        },
      },
      html: {
        minHeight: '100%',
        scrollBehavior: 'smooth',
        [`& *::selection`]: {
          backgroundColor: deepPurple[100],
        },
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
        borderRadius: mui.spacing(3),
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
  MuiFilledInput: {
    defaultProps: {
      disableUnderline: true,
    },
    styleOverrides: {
      root: {
        borderRadius: mui.shape.borderRadius,
      },
      input: {
        borderRadius: mui.shape.borderRadius,
        '&:focus': {
          borderRadius: mui.shape.borderRadius,
        },
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
        ...getTypography().caption,
        background: grey[200],
        boxShadow: mui.shadows[1],
        color: deepPurple[600],
      },
    },
  },
};

export default components;
