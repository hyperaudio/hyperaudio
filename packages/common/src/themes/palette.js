import { createTheme } from '@mui/material/styles';
import { amber, deepPurple } from '@mui/material/colors';

const mui = createTheme();

const palette = {
  ...mui.palette,
  mode: 'light',
  background: {
    ...mui.palette.background,
    default: '#F5F5F7',
    paper: '#fff',
  },
  divider: 'rgba(0,0,0,0.088)',
  primary: deepPurple,
  secondary: amber,
};

export default palette;
