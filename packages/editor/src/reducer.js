import { EditorState, SelectionState, Modifier } from 'draft-js';
import { Map } from 'immutable';

const blockAligners = { current: {} };

const processBlockJoin = (editorState, changedEditorState, aligner) => {
  const contentState = editorState.getCurrentContent();
  const changedContentState = changedEditorState.getCurrentContent();
  const blockKey = changedEditorState.getSelection().getStartKey();

  const blockA = changedEditorState.getCurrentContent().getBlockForKey(blockKey);
  const dataA = blockA.getData();

  const blockB = contentState.getBlockAfter(blockKey);
  const dataB = blockB.getData();

  const itemsA = dataA.get('items');
  const { offset } = itemsA[itemsA.length - 1];

  const items = itemsA.concat(
    dataB.get('items').map(item => ({
      ...item,
      offset: item.offset + offset,
    })),
  );

  const alignedItems =
    items.length > 2 && blockA.getText().trim().split(' ').length > 2 && aligner
      ? aligner(items, blockA.getText(), dataA.get('start'), dataB.get('end'))
      : null; // trim?

  const contentStateWithBlockAData = Modifier.setBlockData(
    changedContentState,
    SelectionState.createEmpty(blockKey),
    Map({
      block: dataA.get('block'),
      speaker: dataA.get('speaker'),
      start: dataA.get('start'),
      end: dataB.get('end'),
      minStart: dataA.get('minStart') ?? dataA.get('start'),
      maxEnd: dataB.get('maxEnd') ?? dataB.get('end'),
      items: alignedItems ?? items,
      // stt: [...dataA.get('stt'), ...dataB.get('stt')], // TODO
    }),
  );

  return EditorState.forceSelection(
    EditorState.push(editorState, contentStateWithBlockAData, 'change-block-data'),
    changedEditorState.getSelection(),
  );
};

const processBlockSplit = (editorState, changedEditorState, aligner) => {
  const changedContentState = changedEditorState.getCurrentContent();
  const blockKey = changedEditorState.getSelection().getStartKey();

  const blockA = changedEditorState.getCurrentContent().getBlockBefore(blockKey);
  const dataA = blockA.getData();
  const countA = blockA.getText().trim().split(' ').length; // TBD trim the textA too?
  const items = dataA.get('items');
  const itemsA = items.slice(0, countA);

  const blockB = changedEditorState.getCurrentContent().getBlockForKey(blockKey);
  const countB = blockB.getText().split(' ').length;
  const itemsB = items.slice(-countB).map(item => ({
    ...item,
    offset: item.offset - items.slice(-countB)[0].offset,
  }));

  const alignedItemsA =
    itemsA.length > 2 && blockA.getText().trim().split(' ').length > 2 && aligner
      ? aligner(itemsA, blockA.getText(), dataA.get('start'), itemsA[itemsA.length - 1].end)
      : null;

  const alignedItemsB =
    itemsB.length > 2 && blockB.getText().trim().split(' ').length > 2 && aligner
      ? aligner(
          itemsB,
          blockB.getText(), // trim? what about space at beginning?
          (alignedItemsA ?? itemsA).slice(-1).pop().end,
          dataA.get('end'),
        )
      : null;

  const contentStateWithBlockAData = Modifier.setBlockData(
    changedContentState,
    SelectionState.createEmpty(blockA.getKey()),
    Map({
      block: dataA.get('block'),
      speaker: dataA.get('speaker'),
      start: dataA.get('start'),
      end: (alignedItemsA ?? itemsA)[itemsA.length - 1].end,
      minStart: dataA.get('minStart') ?? dataA.get('start'),
      maxEnd: (alignedItemsA ?? itemsA)[itemsA.length - 1].end,
      items: alignedItemsA ?? itemsA,
      // stt: // TODO
    }),
  );

  const contentStateWithBlockBData = Modifier.setBlockData(
    contentStateWithBlockAData,
    SelectionState.createEmpty(blockKey),
    Map({
      block: dataA.get('block'),
      speaker: dataA.get('speaker'),
      start: (alignedItemsB ?? itemsB)[0].start,
      end: dataA.get('end'),
      items: alignedItemsB ?? itemsB,
      cue: {
        color: dataA.get('cue')?.color ?? 'white',
        start: (alignedItemsB ?? itemsB)[0].start,
        end: dataA.get('cue')?.end ?? dataA.get('end'),
      },
    }),
  );

  return EditorState.forceSelection(
    EditorState.push(editorState, contentStateWithBlockBData, 'change-block-data'),
    changedEditorState.getSelection(),
  );
};

const deferAlignment = (editorState, changedEditorState, aligner, dispatch) => {
  if (!aligner) return;

  const contentState = editorState.getCurrentContent();
  const changedContentState = changedEditorState.getCurrentContent();

  const blockKey = changedEditorState.getSelection().getStartKey();
  const block = changedEditorState.getCurrentContent().getBlockForKey(blockKey);
  const text = block.getText();

  const data = block.getData().toJS();

  let { items, start, end } = data;
  const { minStart = start, maxEnd = end, stt = items } = data;

  start = Math.min(start, minStart);
  end = Math.max(end, maxEnd);

  // TODO skip wide interval if items count = tokens count
  // if (items.length !== text.trim().split(' ').length) {
  //   const itemsText = items.map(({ text }) => text).join(' ');
  //   const offset = text.trim().indexOf(itemsText);

  //   console.log('OFFSET', offset, [text, itemsText]);

  //   if (offset > 0) {
  //     console.log('minStart', offset, text, itemsText);
  //     start = Math.min(start, minStart);
  //   }

  //   if (offset === 0 && text.trim().length - itemsText.length > 0) {
  //     console.log('maxEnd', text.trim().length - itemsText.length, text, itemsText);
  //     end = Math.max(end, maxEnd);
  //   }
  // }

  // TBD use index of item.text.join in text, +/- fuzzy margins to detect which margin changed?

  // const tokens = text.split(' ');
  // TODO check if item0 is part of 1st token -> if so do not use minStart
  // if (text.substring(items[0].offset, items[0].offset + items[0].length) !== items[0].text) {
  //   console.log('useMinStart', text.substring(items[0].offset, items[0].offset + items[0].length), items[0].text);
  //   start = Math.min(start, minStart);
  // }

  // TODO check if last item is part of last token -> if so do not use maxEnd
  // if (
  //   text.trim().substring(text.trim().length - items[items.length - 1].text.length) !== items[items.length - 1].text
  // ) {
  //   console.log(
  //     'useMaxEnd',
  //     text.trim().substring(text.trim().length - items[items.length - 1].text.length),
  //     items[items.length - 1].text,
  //   );
  //   end = Math.max(end, maxEnd);
  // }

  if (
    contentState.getBlockForKey(blockKey) &&
    contentState.getBlockForKey(blockKey).getText() !== text &&
    items &&
    items.length > 2 && // TBD use 1?
    text.split(' ').length > 2
  ) {
    if (window.cancelIdleCallback) {
      blockAligners.current[blockKey] &&
        window.cancelIdleCallback(blockAligners.current[blockKey]) &&
        delete blockAligners.current[blockKey];
    } else {
      blockAligners.current[blockKey] &&
        clearTimeout(blockAligners.current[blockKey]) &&
        delete blockAligners.current[blockKey];
    }

    const callback = () =>
      aligner(items, text, start, end, alignedItems => {
        const textStart = alignedItems?.[0]?.start ?? start;
        const textEnd = alignedItems?.[alignedItems.length - 1]?.end ?? end;

        const data = {
          // block: block.getData().get('block'), // TBD: do we need this?
          speaker: block.getData().get('speaker'),
          items: alignedItems,
          stt,
          start: textStart,
          end: textEnd,
          minStart: Math.min(textStart, start, minStart),
          maxEnd: Math.max(textEnd, end, maxEnd),
          // prealign: { items, start, end },
        };

        console.log('aligner', { prealign: { items, start, end } }, data);

        const contentStateWithBlockData = Modifier.setBlockData(
          changedContentState,
          SelectionState.createEmpty(blockKey),
          Map(data),
        );

        const editorStateWithBlockData = EditorState.forceSelection(
          EditorState.push(changedEditorState, contentStateWithBlockData, 'change-block-data'),
          changedEditorState.getSelection(),
        );

        dispatch({
          type: 'change-block-data',
          editorState: EditorState.create({
            currentContent: editorStateWithBlockData.getCurrentContent(),
            undoStack: changedEditorState.getUndoStack(),
            redoStack: changedEditorState.getRedoStack(),
            selection: changedEditorState.getSelection(),
          }),
        });
      });

    if (window.requestIdleCallback) {
      blockAligners.current[blockKey] = window.requestIdleCallback(callback, { timeout: 250 });
    } else {
      blockAligners.current[blockKey] = window.setTimeout(callback, 100);
    }
  }
};

const reducer = (editorState, { type, editorState: changedEditorState, currentBlock, speaker, aligner, dispatch }) => {
  const contentState = editorState.getCurrentContent();
  const changedContentState = changedEditorState.getCurrentContent();

  const join = changedContentState.getBlockMap().size < contentState.getBlockMap().size;
  const split = changedContentState.getBlockMap().size > contentState.getBlockMap().size;

  console.log({ type, join, split });

  switch (type) {
    case 'insert-characters':
      deferAlignment(editorState, changedEditorState, aligner, dispatch);
      return changedEditorState;
    case 'remove-range':
      if (join) {
        const changedEditorState2 = processBlockJoin(editorState, changedEditorState, aligner);
        deferAlignment(editorState, changedEditorState2, aligner, dispatch);
        return changedEditorState2;
      } else {
        deferAlignment(editorState, changedEditorState, aligner, dispatch);
        return changedEditorState;
      }
    case 'backspace-character':
      if (join) {
        const changedEditorState2 = processBlockJoin(editorState, changedEditorState, aligner);
        deferAlignment(editorState, changedEditorState2, aligner, dispatch);
        return changedEditorState2;
      } else {
        deferAlignment(editorState, changedEditorState, aligner, dispatch);
        return changedEditorState;
      }
    case 'delete-character':
      if (join) {
        const changedEditorState2 = processBlockJoin(editorState, changedEditorState, aligner);
        deferAlignment(editorState, changedEditorState2, aligner, dispatch);
        return changedEditorState2;
      } else {
        deferAlignment(editorState, changedEditorState, aligner, dispatch);
        return changedEditorState;
      }
    case 'split-block':
      if (split) {
        const changedEditorState2 = processBlockSplit(editorState, changedEditorState, aligner);
        deferAlignment(editorState, changedEditorState2, aligner, dispatch);
        return changedEditorState2;
      } else {
        deferAlignment(editorState, changedEditorState, aligner, dispatch);
        return changedEditorState;
      }
    case 'change-speaker': {
      const blockKey = currentBlock.getKey();
      const data = currentBlock.getData().toJS();

      const contentStateWithBlockData = Modifier.setBlockData(
        changedContentState,
        SelectionState.createEmpty(blockKey),
        Map({
          ...data,
          speaker,
        }),
      );

      const editorStateWithBlockData = EditorState.forceSelection(
        EditorState.push(changedEditorState, contentStateWithBlockData, 'change-block-data'),
        changedEditorState.getSelection(),
      );

      return editorStateWithBlockData;
    }
    case 'change-block-data':
      return changedEditorState;
    default:
      deferAlignment(editorState, changedEditorState, aligner, dispatch);
      return changedEditorState;
  }
};

export default reducer;
