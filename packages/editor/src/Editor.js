import React, { useRef, useMemo, useCallback, useReducer } from 'react';
import { Editor as DraftEditor, EditorState, SelectionState, CompositeDecorator, Modifier } from 'draft-js';
import TC from 'smpte-timecode';

import PlayheadDecorator from './PlayheadDecorator';
import reducer from './reducer';

const Editor = ({
  initialState = EditorState.createEmpty(),
  playheadDecorator = PlayheadDecorator,
  decorators = [],
  time = 0,
  seekTo,
  showDialog,
  aligner,
  speakers = {},
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

  const handleClick = useCallback(
    e => {
      if (!editorState) return;
      // console.log(e);

      if (e.target.tagName === 'DIV') {
        const mx = e.clientX;
        const my = e.clientY;
        const { x: bx, y: by } = e.target.getBoundingClientRect();

        const x = mx - bx;
        const y = my - by;

        console.log({ x, y });
        if (x < 100 && y < 20) {
          const selectionState = editorState.getSelection();
          const block = editorState.getCurrentContent().getBlockForKey(selectionState.getAnchorKey());
          showDialog &&
            showDialog({
              target: e.target,
              x,
              y,
              block,
              data: block.getData().toJS(),
            });
        }
      } else {
        const selectionState = editorState.getSelection();
        const block = editorState.getCurrentContent().getBlockForKey(selectionState.getAnchorKey());
        const start = selectionState.getStartOffset();
        const items = block.getData().get('items');
        const item = items?.filter(({ offset }) => offset <= start)?.pop();
        item?.start && seekTo && seekTo(item.start);
      }
    },
    [seekTo, editorState],
  );

  return (
    <div className="Editor" onClick={handleClick}>
      <DraftEditor {...{ editorState, onChange, ...rest }} />
      <style scoped>
        {`
          div[data-block='true'] + div[data-block='true'] {
            margin-top: 1em;
          }
          div[data-block='true'] {
            position: relative;
            padding-left: 100px;
            color: black;
          }
          div[data-block='true'] .Playhead ~ span {
            color: rgba(0,0,0,0.38);
          }
        `}
      </style>
      {editorState
        .getCurrentContent()
        .getBlocksAsArray()
        .map(block => (
          <BlockStyle key={block.getKey()} {...{ block, speakers, time }} />
        ))}
    </div>
  );
};

const BlockStyle = ({ block, speakers, time }) => {
  const speaker = useMemo(() => speakers[block.getData().get('speaker')]?.name ?? 'n/a', [block, speakers]);
  const start = useMemo(() => block.getData().get('start'), [block]);
  const tc = useMemo(() => timecode(start), [start]);

  return (
    <style scoped>
      {`
        div[data-block='true'][data-offset-key="${block.getKey()}-0-0"] {
          color: ${time < start ? 'rgba(0,0,0,0.38)' : 'black'};
        }
        div[data-block='true'][data-offset-key="${block.getKey()}-0-0"]::before {
          position: absolute;
          top: 0;
          left: 0;
          content: url(data:image/svg+xml,${encodeURIComponent(`
            <svg width="100" height="40" xmlns="http://www.w3.org/2000/svg">
              <text x="90" y="18" text-anchor="end" style="font-family: sans-serif; font-size: 13px; fill: #673ab7">
                ${speaker}
              </text>
              <text x="90" y="30" text-anchor="end" style="font-family: monospace; font-size: 9px; fill: #cccccc">
                ${tc}
              </text>
            </svg>
          `)});
        }
        div[data-block='true'][data-offset-key="${block.getKey()}-0-0"]:hover::before {
          content: url(data:image/svg+xml,${encodeURIComponent(`
            <svg width="100" height="40" xmlns="http://www.w3.org/2000/svg">
              <text x="90" y="18" text-anchor="end" style="font-family: sans-serif; font-size: 13px; fill: #000000">
                ${speaker}
              </text>
              <text x="90" y="30" text-anchor="end" style="font-family: monospace; font-size: 9px; fill: #aaaaaa">
                ${tc}
              </text>
            </svg>
          `)});
        }
      `}
    </style>
  );
};

const timecode = (seconds, frameRate = 25, dropFrame = false) =>
  TC(seconds * frameRate, frameRate, dropFrame)
    .toString()
    .split(':')
    .slice(0, 3)
    .join(':');

export default Editor;

// TODO, oe-like paste join paras
