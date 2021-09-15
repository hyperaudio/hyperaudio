import { createTheme } from '@mui/material/styles';

export const defaultTheme = createTheme({
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiIconButton: {
      defaultProps: {
        color: 'primary',
      },
    },
  },
  palette: {
    background: {
      paper: '#fff',
      default: '#f8f8f8',
    },
  },
});
