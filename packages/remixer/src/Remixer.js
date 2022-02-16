import React, { useReducer, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { DragDropContext } from 'react-beautiful-dnd';

import { styled, ThemeProvider } from '@mui/material/styles';

import { defaultTheme } from '@hyperaudio/common';

import Library from './Library';
import Remix from './Remix';
import Source from './Source';

import remixReducer from './reducers/remixReducer';

import '@hyperaudio/common/src/fonts/Inter/inter.css';

const Root = styled('div', {
  shouldForwardProp: prop => !['showSource', 'isSingleMedia'].includes(prop),
})(({ theme, showSource, isSingleMedia }) => ({
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
    flex: `0 0 ${isSingleMedia ? '100%' : '50%'}`,
    flexFlow: 'column nowrap',
    justifyContent: 'flex-start',
    maxWidth: isSingleMedia ? 'auto' : '50%',
    position: 'relative',
    [`&.RemixerPane--Source`]: {
      borderRight: `1px solid ${theme.palette.divider}`,
    },
    [`&.RemixerPane--Remix`]: {
      flexBasis: showSource ? '50%' : '100%',
      maxWidth: showSource ? '50%' : 'none',
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
    // padding: `1px 0`, // a workaround for cut down textfield borders with overflow set below
    textAlign: 'center',
    whiteSpace: 'unset',
  },
  [`& .topbarPush`]: {
    ...theme.mixins.toolbar,
  },
  [`& .transcriptWrap`]: {
    alignItems: 'center',
    borderTop: `1px solid ${theme.palette.divider}`,
    display: 'flex',
    flex: '2 2 66%',
    flexFlow: 'column nowrap',
    height: '100%',
    justifyContent: 'flex-start',
    overflow: 'auto',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      paddingTop: theme.spacing(4),
      paddingBottom: theme.spacing(12),
    },
  },
  [`& .transcriptSnapshotDropArea`]: {
    boxShadow: `0 0 2px 0 ${theme.palette.primary.light} inset`,
    outline: `3px solid ${theme.palette.primary.main}`,
    overflow: 'scroll',
  },
  [`& .transcriptDropArea`]: {
    borderRadius: theme.shape.borderRadius,
    height: '100%',
  },
}));

const Remixer = props => {
  const { editable, media, isSingleMedia } = props;

  const [{ sources, tabs, remix, source }, dispatch] = useReducer(remixReducer, {
    sources: props.sources,
    tabs: props.sources,
    remix: props.remix,
    source: props.sources[0],
  });

  const [showSource, setShowSource] = useState(true);
  const [showLibrary, setShowLibrary] = useState(false);

  const onSourceChange = useCallback(
    id => dispatch({ type: 'sourceOpen', source: props.sources.find(m => m.id === id) }),
    [props],
  );

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
  // console.log('sources', sources);
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

  const onDragEnd = useCallback(event => {
    console.log({ onDragEnd: event });
    event.destination && dispatch({ type: 'dragEnd', event });
  }, []);

  return (
    <ThemeProvider theme={defaultTheme}>
      <Root showSource={showSource} isSingleMedia={isSingleMedia}>
        <div
          className="Layout"
          id="Layout" // used as Dragbar’s bounds
        >
          {editable ? (
            <DragDropContext {...{ onBeforeCapture, onBeforeDragStart, onDragStart, onDragUpdate, onDragEnd }}>
              {showSource && (
                <Source {...{ ...props, sources, tabs, source, onShowLibrary, onSourceChange, onSourceClose }} />
              )}
              {!isSingleMedia && (
                <Remix {...{ ...props, remix, sources, tabs, showSource, setShowSource, onSourceChange, dispatch }} />
              )}
            </DragDropContext>
          ) : (
            <>
              {showSource && <Source {...{ ...props, sources, tabs, source, onShowLibrary, onSourceChange }} />}
              {!isSingleMedia && (
                <Remix {...{ ...props, remix, sources, tabs, showSource, setShowSource, onSourceChange }} />
              )}
            </>
          )}
        </div>
        {showLibrary && <Library {...{ ...props, sources, tabs, onHideLibrary, onSearch, onSourceOpen }} />}
      </Root>
    </ThemeProvider>
  );
};

Remixer.propTypes = {
  editable: PropTypes.bool, // used to allow edit functionality, drag&drop and all that magic
  isSingleMedia: PropTypes.bool, // used for when showing single media (famous remix of one)
};

Remixer.defaultProps = {
  editable: false,
  isSingleMedia: false,
};

export default Remixer;
