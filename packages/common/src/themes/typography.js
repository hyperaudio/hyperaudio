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
  button: { xs: '0.8rem', md: '0.9rem', xl: '1.0rem' },
  overline: { xs: '0.7rem', md: '0.8rem', xl: '0.9rem' },
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
      fontFamily: title,
      fontWeight: '700',
      letterSpacing: '-0.033em',
      lineHeight: '1.22em',
    },
    h2: {
      ...getSizes('h2', mode),
      fontFamily: title,
      fontWeight: '700',
      letterSpacing: '-0.022em',
      lineHeight: '1.22em',
    },
    h3: {
      ...getSizes('h3', mode),
      fontFamily: title,
      fontWeight: '700',
      letterSpacing: '-0.022em',
      lineHeight: '1.22em',
    },
    h4: {
      ...getSizes('h4', mode),
      fontFamily: body,
      fontWeight: '600',
      lineHeight: '1.44em',
    },
    h5: {
      ...getSizes('h5', mode),
      fontFamily: body,
      fontWeight: '600',
      lineHeight: '1.44em',
    },
    h6: {
      ...getSizes('h6', mode),
      fontFamily: body,
      fontWeight: '600',
      lineHeight: '1.44em',
    },
    subtitle1: {
      ...getSizes('subtitle1', mode),
      fontFamily: title,
      fontWeight: 700,
      lineHeight: '1.22em',
    },
    subtitle2: {
      ...getSizes('subtitle2', mode),
      fontFamily: title,
      fontWeight: 700,
      lineHeight: '1.22em',
    },
    body1: {
      ...getSizes('body1', mode),
      fontFamily: body,
      letterSpacing: 'none',
    },
    body2: {
      ...getSizes('body2', mode),
      fontFamily: body,
      letterSpacing: 'none',
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
      fontFamily: body,
      fontWeight: '400',
      letterSpacing: 0,
      lineHeight: '1.44em',
    },
  };
};

// export const fixedTypography = {
//   h1: {
//     fontFamily,
//     fontSize: '2.4rem',
//     fontWeight: '600',
//     letterSpacing: '0',
//     lineHeight: '1.22em',
//   },
//   h2: {
//     fontFamily,
//     fontSize: '2.2rem',
//     fontWeight: '600',
//     letterSpacing: '0',
//     lineHeight: '1.22em',
//   },
//   h3: {
//     fontFamily,
//     fontSize: '2rem',
//     fontWeight: '600',
//     letterSpacing: '0',
//     lineHeight: '1.22em',
//   },
//   h4: {
//     fontFamily,
//     fontSize: '1.5rem',
//     fontWeight: '600',
//     letterSpacing: '0',
//     lineHeight: '1.22em',
//   },
//   h5: {
//     fontFamily,
//     fontSize: '1.4rem',
//     fontWeight: '600',
//     letterSpacing: '0',
//     lineHeight: '1.44em',
//   },
//   h6: {
//     fontFamily,
//     fontSize: '1.3rem',
//     fontWeight: '600',
//     letterSpacing: '0',
//     lineHeight: '1.44em',
//   },
//   subtitle1: {
//     fontFamily,
//     fontSize: '1.2rem',
//     fontWeight: '500',
//     letterSpacing: '0',
//     lineHeight: '1.44em',
//   },
//   subtitle2: {
//     fontFamily,
//     fontSize: '1.1rem',
//     fontWeight: '500',
//     letterSpacing: '0',
//     lineHeight: '1.44em',
//   },
//   body1: {
//     fontFamily,
//     fontSize: '1.1rem',
//     fontWeight: '400',
//     letterSpacing: '0',
//     lineHeight: '1.44em',
//     [mui.breakpoints.up('md')]: {
//       fontSize: '1.18rem',
//     },
//     [mui.breakpoints.up('xl')]: {
//       fontSize: '1.26rem',
//     },
//   },
//   body2: {
//     fontFamily,
//     fontSize: '1rem',
//     fontWeight: '400',
//     letterSpacing: '0',
//     lineHeight: '1.44em',
//   },
//   button: {
//     fontFamily,
//     fontSize: '0.77rem',
//     fontWeight: '500',
//     letterSpacing: '0.055em',
//     lineHeight: '1.44em',
//   },
//   caption: {
//     fontFamily,
//     fontWeight: '400',
//     fontSize: '0.86rem',
//     letterSpacing: '0.011em',
//     lineHeight: '1.11em',
//     [mui.breakpoints.up('md')]: {
//       fontSize: '0.9rem',
//     },
//     [mui.breakpoints.up('xl')]: {
//       fontSize: '0.94rem',
//     },
//   },
//   overline: {
//     fontFamily,
//     fontWeight: '400',
//     fontSize: '0.8rem',
//     letterSpacing: '0.022em',
//     lineHeight: '1.44em',
//   },
// };
// export const responsiveTypography = {
//   ...fixedTypography,
//   h1: {
//     [mui.breakpoints.up('md')]: {
//       fontSize: '3rem',
//     },
//     [mui.breakpoints.up('xl')]: {
//       fontSize: '3.6rem',
//     },
//   },
//   h2: {
//     [mui.breakpoints.up('md')]: {
//       fontSize: '2.6rem',
//     },
//     [mui.breakpoints.up('xl')]: {
//       fontSize: '3rem',
//     },
//   },
//   h3: {
//     [mui.breakpoints.up('md')]: {
//       fontSize: '2.2rem',
//     },
//     [mui.breakpoints.up('xl')]: {
//       fontSize: '2.4rem',
//     },
//   },
//   h4: {
//     [mui.breakpoints.up('md')]: {
//       fontSize: '1.8rem',
//     },
//     [mui.breakpoints.up('xl')]: {
//       fontSize: '2.1rem',
//     },
//   },
//   h5: {
//     [mui.breakpoints.up('md')]: {
//       fontSize: '1.6rem',
//     },
//     [mui.breakpoints.up('xl')]: {
//       fontSize: '1.8rem',
//     },
//   },
//   h6: {
//     [mui.breakpoints.up('md')]: {
//       fontSize: '1.4rem',
//     },
//     [mui.breakpoints.up('xl')]: {
//       fontSize: '1.5rem',
//     },
//   },
//   subtitle1: {
//     [mui.breakpoints.up('md')]: {
//       fontSize: '1.28rem',
//     },
//     [mui.breakpoints.up('xl')]: {
//       fontSize: '1.36rem',
//     },
//   },
//   subtitle2: {
//     [mui.breakpoints.up('md')]: {
//       fontSize: '1.18rem',
//     },
//     [mui.breakpoints.up('xl')]: {
//       fontSize: '1.26rem',
//     },
//   },
//   body1: {
//     [mui.breakpoints.up('md')]: {
//       fontSize: '1.18rem',
//     },
//     [mui.breakpoints.up('xl')]: {
//       fontSize: '1.26rem',
//     },
//   },
//   body2: {
//     [mui.breakpoints.up('md')]: {
//       fontSize: '1.08rem',
//     },
//     [mui.breakpoints.up('xl')]: {
//       fontSize: '1.16rem',
//     },
//   },
//   button: {
//     [mui.breakpoints.up('md')]: {
//       fontSize: '0.88rem',
//     },
//     [mui.breakpoints.up('xl')]: {
//       fontSize: '0.99rem',
//     },
//   },
//   caption: {
//     [mui.breakpoints.up('md')]: {
//       fontSize: '0.9rem',
//     },
//     [mui.breakpoints.up('xl')]: {
//       fontSize: '0.94rem',
//     },
//   },
//   overline: {
//     [mui.breakpoints.up('md')]: {
//       fontSize: '0.84rem',
//     },
//     [mui.breakpoints.up('xl')]: {
//       fontSize: '0.88rem',
//     },
//   },
// };
