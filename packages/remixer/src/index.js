import React from 'react';
import _ from 'lodash';

import Fab from '@mui/material/Fab';
import Tooltip from '@mui/material/Tooltip';
import { styled, ThemeProvider } from '@mui/material/styles';

import { HyperaudioIcon } from './icons';
import { defaultTheme } from './themes';

import Library from './Library';
import Remix from './Remix';
import Source from './Source';
import GlobalStyles from './GlobalStyles';

import './fonts/Inter/inter.css';

const Root = styled('div', {
  shouldForwardProp: prop => prop !== 'showSource',
})(({ theme, showSource }) => ({
  height: '100%',
  position: 'relative',

  // layout
  [`& .Layout`]: {
    alignContent: 'flex-start',
    alignItems: 'stretch',
    display: 'flex',
    flexFlow: 'row nowrap',
    height: '100%',
    justifyContent: 'space-between',
  },

  // panes
  [`& .RemixerPane`]: {
    alignContent: 'flex-start',
    alignItems: 'stretch',
    display: 'flex',
    flex: '0 0 50%',
    flexFlow: 'column nowrap',
    justifyContent: 'flex-start',
    maxWidth: '50%',
    position: 'relative',
    [`&.RemixerPane--Source`]: {
      borderRight: `1px solid ${theme.palette.divider}`,
      [theme.breakpoints.down('md')]: {
        display: 'none',
      },
    },
    [`&.RemixerPane--Remix`]: {
      flexBasis: showSource ? '50%' : '100%',
      maxWidth: showSource ? '50%' : 'none',
      [theme.breakpoints.down('md')]: {
        flexBasis: '100%',
        maxWidth: 'none',
      },
    },
    [`&.RemixerPane--Library`]: {
      bottom: 0,
      left: 0,
      position: 'absolute',
      right: '50%',
      top: 0,
    },
  },

  // topbars
  [`& .topbar`]: {
    alignItems: 'center',
    display: 'flex',
    flexDirecton: 'row',
    justifyContent: 'flex-start',
    left: 0,
    position: 'absolute',
    right: 0,
  },
  [`& .topbarSide`]: {
    flexGrow: 0,
    flexShrink: 0,
    [`&.topbarSide--left`]: {
      textAlign: 'left',
    },
    [`&.topbarSide--right`]: {
      textAlign: 'right',
    },
  },
  [`& .topbarCore`]: {
    flexBasis: '100%',
    flexGrow: 1,
    flexShrink: 1,
    height: '100%',
    overflowX: 'auto !important',
    overflow: 'visible',
    textAlign: 'center',
    whiteSpace: 'unset',
  },
  [`& .topbarPush`]: {
    ...theme.mixins.toolbar,
  },
}));

const Badge = styled(Fab)(({ theme }) => ({
  bottom: theme.spacing(2),
  position: 'fixed',
  right: theme.spacing(2),
}));

export const Remixer = props => {
  const { editable, sources } = props;

  const [showSource, setShowSource] = React.useState(true);
  const [showLibrary, setShowLibrary] = React.useState(true); // TODO: default to false
  const [source, setSource] = React.useState(sources[0]);

  const onSourceChange = id => setSource(_.find(sources, o => o.id === id));

  console.group('index.js');
  console.log('sources', sources);
  console.log('source', source);
  console.groupEnd();

  return (
    <ThemeProvider theme={defaultTheme}>
      <GlobalStyles />
      <Root showSource={showSource}>
        <div
          className="Layout"
          id="Layout" // used as Dragbar’s bounds
        >
          {showSource && (
            <Source
              {...props}
              onShowLibrary={() => setShowLibrary(true)}
              onSourceChange={onSourceChange}
              source={source}
            />
          )}
          <Remix {...props} showSource={showSource} setShowSource={setShowSource} onSourceChange={onSourceChange} />
        </div>
        {!editable && (
          <Tooltip title="Visit Hyperaudio">
            <Badge aria-label="Visit Hyperaudio" color="primary" href="https://hyper.audio" target="_blank">
              <HyperaudioIcon />
            </Badge>
          </Tooltip>
        )}
        {showLibrary && <Library {...props} onHideLibrary={() => setShowLibrary(false)} />}
      </Root>
    </ThemeProvider>
  );
};

Remixer.defaultProps = {
  editable: false,
};
