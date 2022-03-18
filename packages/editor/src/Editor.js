import React, { useRef, useMemo, useCallback } from 'react';
import { Editor as DraftEditor, EditorState, SelectionState, CompositeDecorator, Modifier } from 'draft-js';
import { Map } from 'immutable';

import PlayheadDecorator from './PlayheadDecorator';
import reducer from './reducer';

const Editor = ({
  initialState = EditorState.createEmpty(),
  playheadDecorator = PlayheadDecorator,
  decorators = [],
  time = 0,
  aligner,
  ...rest
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const onChange = useCallback(
    editorState => dispatch({ type: editorState.getLastChangeType(), editorState, aligner, dispatch }),
    [aligner],
  );

  const editorState = useMemo(
    () =>
      EditorState.set(state, {
        decorator: new CompositeDecorator([
          {
            strategy: (contentBlock, callback, contentState) =>
              playheadDecorator.strategy(contentBlock, callback, contentState, time),
            component: playheadDecorator.component,
          },
          ...decorators,
        ]),
      }),
    [state, time],
  );

  return <DraftEditor {...{ editorState, onChange, ...rest }} />;
};

export default Editor;

// TODO, oe-like paste join paras
