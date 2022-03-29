import { createTheme } from '@mui/material/styles';

const mui = createTheme();

const sizes = {
  h1: { xs: '2.4rem', md: '3.2rem', xl: '3.8rem' },
  h2: { xs: '2.2rem', md: '2.9rem', xl: '3.3rem' },
  h3: { xs: '2.0rem', md: '2.6rem', xl: '2.8rem' },
  h4: { xs: '1.8rem', md: '2.3rem', xl: '2.3rem' },
  h5: { xs: '1.6rem', md: '1.7rem', xl: '1.8rem' },
  h6: { xs: '1.4rem', md: '1.5rem', xl: '1.6rem' },
  subtitle1: { xs: '1.5rem', md: '1.6rem', xl: '1.7rem' },
  subtitle2: { xs: '1.3rem', md: '1.4rem', xl: '1.5rem' },
  body1: { xs: '1.2rem', md: '1.3rem', xl: '1.4rem' },
  body2: { xs: '1.0rem', md: '1.1rem', xl: '1.2rem' },
  button: { xs: '0.96rem', md: '1.0rem', xl: '1.04rem' },
  overline: { xs: '0.8rem', md: '0.8rem', xl: '0.9rem' },
  caption: { xs: '0.8rem', md: '0.85rem', xl: '0.9rem' },
};

const title = 'Quicksand, Helvetica, Arial, sans-serif';
const body = 'Inter, Helvetica, Arial, sans-serif';

const getSizes = (variant, mode) => {
  let base = { fontSize: sizes[variant].xs };
  let extension;

  if (mode === 'responsive') {
    extension = {
      [mui.breakpoints.up('md')]: {
        fontSize: sizes[variant].md,
      },
      [mui.breakpoints.up('xl')]: {
        fontSize: sizes[variant].xl,
      },
    };
  }
  return {
    ...base,
    ...extension,
  };
};

export const getTypography = mode => {
  return {
    ...mui.typography,
    fontFamily: body,
    h1: {
      ...getSizes('h1', mode),
      // fontFamily: title,
      fontWeight: '600',
      letterSpacing: '-0.011em',
      lineHeight: '1.22em',
    },
    h2: {
      ...getSizes('h2', mode),
      // fontFamily: title,
      fontWeight: '700',
      letterSpacing: '-0.022em',
      lineHeight: '1.22em',
    },
    h3: {
      ...getSizes('h3', mode),
      fontWeight: '500',
      letterSpacing: '-0.022em',
      lineHeight: '1.22em',
    },
    h4: {
      ...getSizes('h4', mode),
      fontWeight: '600',
      lineHeight: '1.44em',
    },
    h5: {
      ...getSizes('h5', mode),
      fontWeight: '600',
      lineHeight: '1.33em',
    },
    h6: {
      ...getSizes('h6', mode),
      fontWeight: '600',
      lineHeight: '1.44em',
    },
    subtitle1: {
      ...getSizes('subtitle1', mode),
      fontWeight: 500,
      lineHeight: '1.44em',
    },
    subtitle2: {
      ...getSizes('subtitle2', mode),
      fontWeight: 500,
      lineHeight: '1.44em',
    },
    body1: {
      ...getSizes('body1', mode),
      letterSpacing: 'none',
      lineHeight: '1.44em',
    },
    body2: {
      ...getSizes('body2', mode),
      letterSpacing: 'none',
      lineHeight: '1.44em',
    },
    button: {
      ...getSizes('button', mode),
      fontFamily: title,
      letterSpacing: '0.033em',
      fontWeight: '700',
    },
    overline: {
      ...getSizes('overline', mode),
      fontFamily: title,
      fontWeight: '700',
      letterSpacing: '0.033em',
      lineHeight: '1.44em',
    },
    caption: {
      ...getSizes('caption', mode),
      fontWeight: '400',
      letterSpacing: 0,
      lineHeight: '1.44em',
    },
  };
};
