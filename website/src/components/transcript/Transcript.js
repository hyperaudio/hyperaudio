/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-use-before-define */
import React, { useRef, useMemo, useCallback, useState, useEffect } from 'react';
import { Editor, EditorState, ContentState, CompositeDecorator, EditorBlock, convertFromRaw } from 'draft-js';
import { nanoid } from 'nanoid';
import * as cldrSegmentation from 'cldr-segmentation';

const Transcript = ({ transcript, time = 0, player }) => {
  const editor = useRef();
  useEffect(() => editor.current && editor.current.focus(), [editor]);

  // const [interval, setInterval] = useState([0, 0]);
  // const intervals = useMemo(
  //   () => transcript.flatMap(({ items }) => items.map(([, start, duration]) => [start, start + duration])),
  //   [transcript],
  // );

  // useEffect(() => {
  //   const [start, end] = interval;
  //   if (start <= time && time < end) return;

  //   const nextInterval = intervals.find(([start, end]) => start <= time && time < end);
  //   nextInterval && setInterval(nextInterval);
  // }, [time, interval, intervals]);

  // const tick = interval[0];
  // console.log(tick);

  const tick = time;

  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  useEffect(
    () =>
      transcript &&
      setEditorState(
        EditorState.createWithContent(
          convertFromRaw({ blocks: createFromTranscript(transcript), entityMap: createEntityMap([]) }),
          composeDecorators(tick),
        ),
      ),
    [transcript],
  );

  const [playedBlocks, setPlayedBlocks] = useState([]);

  const handleChange = useCallback(changedEditorState => setEditorState(changedEditorState), []);

  useEffect(() => {
    if (!tick) return;
    // console.log(tick);

    setPlayedBlocks(
      editorState
        .getCurrentContent()
        .getBlocksAsArray()
        .filter(block => {
          const data = block.getData();

          return data.get('start') <= tick;
        })
        .map(block => block.getKey()),
    );

    setEditorState(
      EditorState.set(editorState, {
        decorator: composeDecorators(tick),
      }),
    );
  }, [tick]);

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
      <Editor ref={editor} editorState={editorState} onChange={handleChange} blockRendererFn={customBlockRenderer} />
    </div>
  );
};

const customBlockRenderer = contentBlock => {
  const type = contentBlock.getType();
  if (type === 'paragraph') {
    return {
      component: CustomBlock,
      editable: type === 'paragraph',
      props: {},
    };
  }
  return null;
};

const composeDecorators = time =>
  new CompositeDecorator([
    // ...decorators,
    {
      strategy: (contentBlock, callback, contentState) =>
        playheadDecorator.strategy(contentBlock, callback, contentState, time),
      component: playheadDecorator.component,
    },
  ]);

const PlayheadSpan = ({ children }) => <span className="playhead">{children}</span>;

const CustomBlock = props => {
  const {
    block,
    // blockProps: { editorState, setEditorState },
  } = props;

  const speaker = useMemo(() => block.getData().get('speaker'), [block]);

  return (
    <div className="customBlock">
      <div contentEditable={false} style={{ userSelect: 'none' }}>
        <span>{speaker}</span>
      </div>
      <EditorBlock {...props} />
    </div>
  );
};

const createFromTranscript = transcript =>
  transcript.transcript ? createFromTranscriptItems(transcript.transcript) : createFromTranscriptBlocks(transcript);

const createFromTranscriptBlocks = transcript =>
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
    const { start, end, items } = contentBlock.getData().toJS();

    if (start <= time && time < end) {
      const item = items?.filter(({ start }) => start <= time).pop();
      item && callback(item.offset, item.offset + item.length);
    }
  },
  component: PlayheadSpan,
};
export const createFromTranscriptItems = (
  transcript,
  {
    language = 'en_GB',
    start = null,
    end = null,
    maxSentences = 7,
    maxGap = 2,
    suppressions = cldrSegmentation.suppressions.all,
    entityKey = 'pilcrow',
  } = {},
) => {
  const items = transcript.items
    // parse timings
    .map(({ start, end, type, alternatives: [{ content: text }] }) => ({
      start: parseFloat(start, 10),
      end: parseFloat(end, 10),
      type,
      text,
    }))
    // filter by start/end if any
    .filter(item => (!start || start <= item.start) && (!end || item.end <= end))
    // merge punctuation, tag End-Of-Sentence (eos)
    .map((item, i, arr) => {
      if (i === 0 || item.type === 'word') return item;

      // append punctuation to previous item
      // TODO determine which punctuation needs prepending (¿item)
      arr[i - 1].text += item.text;
      arr[i - 1].punct = item.text;

      // determine sentence break with next word
      if (
        i === arr.length - 1 ||
        cldrSegmentation.sentenceSplit(`${arr[i - 1].text} ${arr[i + 1].text}`, suppressions).length > 1
      )
        arr[i - 1].eos = true;
      // TODO determine sentence break with previous word for prepended punctuation
      return item;
    })
    // remove punctuation
    .filter(({ type }) => type === 'word')
    // compute gaps
    .map((item, i, arr) => ({
      ...item,
      gap: i === arr.length - 1 ? 0 : arr[i + 1].start - item.end,
    }));

  console.log(items);

  const blocks = items
    .reduce(
      (acc, { start, end, gap, text, punct, eos }) => {
        const block = acc.pop();

        if (block.data.items.length === 0) block.data.start = start;
        block.data.end = end;

        block.data.items.push({
          key: `i_${nanoid(5)}`,
          start,
          end,
          gap,
          text,
          punct,
          eos,
          length: text.length,
          offset: block.text.length === 0 ? 0 : block.text.length + 1,
        });

        block.text += block.text !== '' ? ` ${text}` : text;

        if (eos) {
          block.data.sentences++;

          if (block.data.sentences % maxSentences === 0 || gap > maxGap)
            return [
              ...acc,
              block,
              {
                key: `b_${nanoid(5)}`,
                text: '',
                type: 'paragraph',
                entityRanges: [],
                inlineStyleRanges: [],
                data: {
                  items: [],
                  sentences: 1,
                },
              },
            ];
        }

        return [...acc, block];
      },
      [
        {
          key: `b_${nanoid(5)}`,
          text: '',
          type: 'paragraph',
          entityRanges: [],
          inlineStyleRanges: [],
          data: {
            items: [],
            sentences: 1,
          },
        },
      ],
    )
    // filter out empty blocks
    .filter(({ text }) => text.length > 0)
    // compute subtitle breaks
    .map(block => {
      const items = block.data.items;
      const lastItem = items[items.length - 1];
      let lastBreak = 0;

      while (lastBreak < lastItem.offset + lastItem.length) {
        const i = items.findIndex(({ offset, length }) => offset + length - lastBreak >= 37 * 2);
        if (i === -1) break;

        // find candidates under the total char length
        const candidates = items.slice(i - 5 < 0 ? 0 : i - 5, i);

        // select the last eos or last punctuation or last candidate (note the array was reversed)
        let item =
          candidates.reverse().find(({ eos }) => eos) ?? candidates.find(({ punct }) => punct) ?? candidates[0];

        // avoid widows
        if (i < items.length - 5) {
          // look ahead 2 items for punctuation
          item = items.slice(i, i + 2).find(({ punct }) => punct) ?? item;
        } else if (i >= items.length - 5) {
          // we have few items left, use first candidates (eos, punct or first)
          item = candidates.reverse().find(({ eos }) => eos) ?? candidates.find(({ punct }) => punct) ?? candidates[0];
        }

        item.pilcrow = true;
        lastBreak = item.offset + item.length + 1;
      }

      lastItem.pilcrow = true;

      return block;
    })
    // make each entityKey (pilcrow) an entity
    .map(block => ({
      ...block,
      entityRanges: block.data.items.filter(item => !!item[entityKey]).map(item => ({ ...item, type: entityKey })),
    }));

  console.log(blocks);

  return blocks;
};

export default Transcript;
