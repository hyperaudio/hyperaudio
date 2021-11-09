import React, { useReducer, useState, useCallback } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
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

import remixReducer from './reducers/remixReducer';

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
    padding: `1px 0`, // a workaround for cut down textfield borders with overflow set below
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
  const { editable, media } = props;

  const [{ sources, remix }, dispatch] = useReducer(remixReducer, { sources: props.sources, remix: props.remix });
  const [source, setSource] = useState(sources[0]);

  const [showSource, setShowSource] = useState(true);
  const [showLibrary, setShowLibrary] = useState(false);

  const onSourceChange = useCallback(id => setSource(_.find(sources, o => o.id === id)), [sources]);

  const onShowLibrary = useCallback(() => setShowLibrary(true), []);
  const onHideLibrary = useCallback(() => setShowLibrary(false), []);

  const onSearch = useCallback(string => console.log('onSearch', string), []);
  const onSourceOpen = useCallback(
    id => {
      dispatch({ type: 'sourceOpen', source: media.find(m => m.id === id) });
    },
    [media],
  );
  const onSourceClose = useCallback(
    id => {
      dispatch({ type: 'sourceClose', id });
    },
    [media],
  );

  console.group('index.js');
  console.log('sources', sources);
  console.log('source', source);
  console.groupEnd();

  const onBeforeCapture = useCallback(e => {
    console.log({ onBeforeCapture: e });
  }, []);

  const onBeforeDragStart = useCallback(e => {
    console.log({ onBeforeDragStart: e });
  }, []);

  const onDragStart = useCallback(e => {
    console.log({ onDragStart: e });
  }, []);

  const onDragUpdate = useCallback(e => {
    console.log({ onDragUpdate: e });
  }, []);

  const onDragEnd = useCallback(e => {
    console.log({ onDragEnd: e });
  }, []);

  return (
    <ThemeProvider theme={defaultTheme}>
      <GlobalStyles />
      <Root showSource={showSource}>
        <div
          className="Layout"
          id="Layout" // used as Dragbar’s bounds
        >
          {editable ? (
            <DragDropContext {...{ onBeforeCapture, onBeforeDragStart, onDragStart, onDragUpdate, onDragEnd }}>
              {showSource && <Source {...{ ...props, sources, source, onShowLibrary, onSourceChange }} />}
              <Remix {...{ ...props, remix, showSource, setShowSource, onSourceChange }} />
            </DragDropContext>
          ) : (
            <>
              {showSource && <Source {...{ ...props, sources, source, onShowLibrary, onSourceChange }} />}
              <Remix {...{ ...props, remix, showSource, setShowSource, onSourceChange }} />
            </>
          )}
        </div>
        {!editable && (
          <Tooltip title="Visit Hyperaudio">
            <Badge aria-label="Visit Hyperaudio" color="primary" href="https://hyper.audio" target="_blank">
              <HyperaudioIcon />
            </Badge>
          </Tooltip>
        )}
        {showLibrary && <Library {...{ ...props, sources, onHideLibrary, onSearch, onSourceOpen }} />}
      </Root>
    </ThemeProvider>
  );
};

Remixer.defaultProps = {
  editable: false,
};
