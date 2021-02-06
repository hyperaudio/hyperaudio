/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-use-before-define */
import React, { useRef, useCallback, useState, useEffect } from 'react';
import { Editor, EditorState, ContentState, CompositeDecorator, EditorBlock, convertFromRaw } from 'draft-js';
import { nanoid } from 'nanoid';

// import './transcript.css';

const Transcript = ({ transcript, time = 0, player }) => {
  const editor = useRef();
  useEffect(() => editor.current && editor.current.focus(), [editor]);

  const composeDecorators = useCallback(
    time =>
      new CompositeDecorator([
        // ...decorators,
        {
          strategy: (contentBlock, callback, contentState) =>
            playheadDecorator.strategy(contentBlock, callback, contentState, time),
          component: playheadDecorator.component,
        },
      ]),
    [],
  );

  const [editorState, setEditorState] = useState(
    transcript
      ? EditorState.createWithContent(
          convertFromRaw({ blocks: createFromTranscript(transcript), entityMap: createEntityMap([]) }),
          composeDecorators(time),
        )
      : EditorState.createEmpty(),
  );
  const [playedBlocks, setPlayedBlocks] = useState([]);

  const customBlockRenderer = contentBlock => {
    const type = contentBlock.getType();
    if (type === 'paragraph') {
      return {
        component: CustomBlock,
        editable: type === 'paragraph',
        props: {
          setEditorState,
          editorState,
        },
      };
    }
    return null;
  };

  const handleChange = useCallback(changedEditorState => setEditorState(changedEditorState), []);

  useEffect(() => {
    setPlayedBlocks(
      editorState
        .getCurrentContent()
        .getBlocksAsArray()
        .filter(block => {
          const data = block.getData();

          return data.get('start') <= time;
        })
        .map(block => block.getKey()),
    );

    setEditorState(
      EditorState.set(editorState, {
        decorator: composeDecorators(time),
      }),
    );
  }, [time]);

  const handleClick = useCallback(() => {
    const selectionState = editorState.getSelection();
    const block = editorState.getCurrentContent().getBlockForKey(selectionState.getAnchorKey());

    console.log(block);

    const start = selectionState.getStartOffset();
    const items = block.getData().get('items');
    const item = items?.filter(({ offset }) => offset <= start).pop();

    console.log(start, item);

    item && player.current?.seekTo(item.start, 'seconds');
  }, [editorState, player]);

  return (
    <div className="Transcript" onClick={handleClick}>
      <style scoped>{playedBlocks.map(key => `div[data-offset-key='${key}-0-0'] { color: black; }`)}</style>
      <style scoped>{`.Transcript {
        /* border: 1px solid #cccccc; */
        line-height: 1.5em;
      }

      .Transcript div[data-block] + div[data-block] {
        margin-top: 1em;

        /* content-visibility: auto;
        contain-intrinsic-size: 500px; */
      }

      .Transcript div[data-block] {
        color: grey;
      }

      .Transcript .playhead {
        color: black;
        border-bottom: 1px solid red;
        position: relative;
      }

      .playhead ~ span {
        color: grey;
      }`}</style>
      <Editor ref={editor} editorState={editorState} onChange={handleChange} />
    </div>
  );
};
// blockRendererFn={customBlockRenderer}
const PlayheadSpan = ({ children }) => <span className="playhead">{children}</span>;

// const CustomBlock = props => {
//   const {
//     contentState,
//     block,
//     // blockProps: { editorState, setEditorState },
//   } = props;

//   return (
//     <div className="customBlock">
//       <div contentEditable={false} style={{ userSelect: 'none' }}></div>
//       <EditorBlock {...props} />
//     </div>
//   );
// };

const createFromTranscript = transcript =>
  transcript.map(({ start, duration, speaker, items }) => ({
    key: `b_${nanoid(5)}`,
    type: 'paragraph',
    text: items.map(([text]) => text).join(' '),
    entityRanges: [],
    inlineStyleRanges: [],
    data: {
      start,
      end: start + duration,
      speaker,
      items: items.map(([text, start, duration], i) => ({
        key: `i_${nanoid(5)}`,
        start,
        end: start + duration,
        text,
        offset:
          items
            .slice(0, i)
            .map(([text]) => text)
            .join(' ').length + (i === 0 ? 0 : 1),
        length: text.length,
      })),
    },
  }));

const flatten = list => list.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []);

const createEntityMap = blocks =>
  flatten(blocks.map(block => block.entityRanges)).reduce(
    (acc, data) => ({
      ...acc,
      [data.key]: { type: 'TOKEN', mutability: 'MUTABLE', data },
    }),
    {},
  );

const playheadDecorator = {
  strategy: (contentBlock, callback, contentState, time) => {
    const data = contentBlock.getData();
    const start = data.get('start');
    const end = data.get('end');

    if (start <= time && time < end) {
      const items = data.get('items');
      const item = items?.filter(({ start }) => start <= time).pop();
      if (!item) return;

      callback(item.offset, item.offset + item.length);
    }
  },
  component: PlayheadSpan,
};

export default Transcript;
