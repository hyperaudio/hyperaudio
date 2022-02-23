import { createTheme } from '@mui/material/styles';

const mui = createTheme();

const fontFamily = "'Inter', 'Helvetica', 'Arial', sans-serif";

const typography = {
  fontFamily,
  h1: {
    fontFamily,
    fontSize: '2.4rem',
    fontWeight: '600',
    letterSpacing: '0',
    lineHeight: '1.22em',
    [mui.breakpoints.up('md')]: {
      fontSize: '3rem',
    },
    [mui.breakpoints.up('xl')]: {
      fontSize: '3.6rem',
    },
  },
  h2: {
    fontFamily,
    fontSize: '2.2rem',
    fontWeight: '600',
    letterSpacing: '0',
    lineHeight: '1.22em',
    [mui.breakpoints.up('md')]: {
      fontSize: '2.6rem',
    },
    [mui.breakpoints.up('xl')]: {
      fontSize: '3rem',
    },
  },
  h3: {
    fontFamily,
    fontSize: '2rem',
    fontWeight: '600',
    letterSpacing: '0',
    lineHeight: '1.22em',
    [mui.breakpoints.up('md')]: {
      fontSize: '2.2rem',
    },
    [mui.breakpoints.up('xl')]: {
      fontSize: '2.4rem',
    },
  },
  h4: {
    fontFamily,
    fontSize: '1.5rem',
    fontWeight: '600',
    letterSpacing: '0',
    lineHeight: '1.22em',
    [mui.breakpoints.up('md')]: {
      fontSize: '1.8rem',
    },
    [mui.breakpoints.up('xl')]: {
      fontSize: '2.1rem',
    },
  },
  h5: {
    fontFamily,
    fontSize: '1.4rem',
    fontWeight: '600',
    letterSpacing: '0',
    lineHeight: '1.44em',
    [mui.breakpoints.up('md')]: {
      fontSize: '1.6rem',
    },
    [mui.breakpoints.up('xl')]: {
      fontSize: '1.8rem',
    },
  },
  h6: {
    fontFamily,
    fontSize: '1.3rem',
    fontWeight: '600',
    letterSpacing: '0',
    lineHeight: '1.44em',
    [mui.breakpoints.up('md')]: {
      fontSize: '1.4rem',
    },
    [mui.breakpoints.up('xl')]: {
      fontSize: '1.5rem',
    },
  },
  subtitle1: {
    fontFamily,
    fontSize: '1.2rem',
    fontWeight: '500',
    letterSpacing: '0',
    lineHeight: '1.44em',
    [mui.breakpoints.up('md')]: {
      fontSize: '1.28rem',
    },
    [mui.breakpoints.up('xl')]: {
      fontSize: '1.36rem',
    },
  },
  subtitle2: {
    fontFamily,
    fontSize: '1.1rem',
    fontWeight: '500',
    letterSpacing: '0',
    lineHeight: '1.44em',
    [mui.breakpoints.up('md')]: {
      fontSize: '1.18rem',
    },
    [mui.breakpoints.up('xl')]: {
      fontSize: '1.26rem',
    },
  },
  body1: {
    fontFamily,
    fontSize: '1.1rem',
    fontWeight: '400',
    letterSpacing: '0',
    lineHeight: '1.44em',
    [mui.breakpoints.up('md')]: {
      fontSize: '1.18rem',
    },
    [mui.breakpoints.up('xl')]: {
      fontSize: '1.26rem',
    },
  },
  body2: {
    fontFamily,
    fontSize: '1rem',
    fontWeight: '400',
    letterSpacing: '0',
    lineHeight: '1.44em',
    [mui.breakpoints.up('md')]: {
      fontSize: '1.08rem',
    },
    [mui.breakpoints.up('xl')]: {
      fontSize: '1.16rem',
    },
  },
  button: {
    fontFamily,
    fontSize: '0.88rem',
    fontWeight: '600',
    letterSpacing: '0.055em',
    lineHeight: '1.44em',
    [mui.breakpoints.up('md')]: {
      fontSize: '0.92rem',
    },
    [mui.breakpoints.up('xl')]: {
      fontSize: '0.96rem',
    },
  },
  caption: {
    fontFamily,
    fontWeight: '400',
    fontSize: '0.86rem',
    letterSpacing: '0.011em',
    lineHeight: '1.11em',
    [mui.breakpoints.up('md')]: {
      fontSize: '0.9rem',
    },
    [mui.breakpoints.up('xl')]: {
      fontSize: '0.94rem',
    },
  },
  overline: {
    fontFamily,
    fontWeight: '400',
    fontSize: '0.8rem',
    letterSpacing: '0.022em',
    lineHeight: '1.44em',
    [mui.breakpoints.up('md')]: {
      fontSize: '0.84rem',
    },
    [mui.breakpoints.up('xl')]: {
      fontSize: '0.88rem',
    },
  },
};

export default typography;
