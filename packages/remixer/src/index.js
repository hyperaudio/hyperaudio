import React from 'react';

import { styled, ThemeProvider } from '@mui/material/styles';

import Remix from './Remix';
import Source from './Source';
import { defaultTheme } from './themes';

const Layout = styled('div')(({ theme, showSource }) => ({
  alignContent: 'flex-start',
  alignItems: 'stretch',
  display: 'flex',
  flexFlow: 'row nowrap',
  height: '100%',
  justifyContent: 'space-between',
  [`& .RemixerPane`]: {
    alignContent: 'flex-start',
    alignItems: 'stretch',
    display: 'flex',
    flex: '0 0 50%',
    flexFlow: 'column nowrap',
    justifyContent: 'flex-start',
    maxWidth: '50%',
    [`&.RemixerPane--Source`]: {
      borderRight: `1px solid ${theme.palette.divider}`,
      [theme.breakpoints.down('md')]: {
        display: 'none',
      },
    },
    [`&.RemixerPane--Remix`]: {
      flexBasis: showSource ? '50%' : '100%',
      maxWidth: showSource ? '50%' : 'none',
    },
  },
  [`& .topbar`]: {
    alignItems: 'center',
    display: 'flex',
    flexDirecton: 'row',
    justifyContent: 'space-between',
  },
  [`& .topbarSide`]: {
    flex: `0 1 ${theme.spacing(12)}`,
    [`&.topbarSide--left`]: {
      textAlign: 'left',
    },
    [`&.topbarSide--right`]: {
      textAlign: 'right',
    },
  },
}));

export const Remixer = ({ editable = false, remix, source, sources }) => {
  const [showSource, setShowSource] = React.useState(true);
  return (
    <ThemeProvider theme={defaultTheme}>
      <Layout showSource={showSource}>
        {showSource && <Source editable={editable} source={source} sources={sources} />}
        <Remix editable={editable} remix={remix} showSource={showSource} setShowSource={setShowSource} />
      </Layout>
    </ThemeProvider>
  );
};
