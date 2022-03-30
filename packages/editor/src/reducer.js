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
      items: alignedItems ?? items,
      cue: {
        color: dataA.get('cue')?.color ?? 'white',
        start: dataA.get('cue')?.start ?? dataA.get('start'),
        end: dataB.get('cue')?.end ?? dataB.get('end'),
      },
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
      items: alignedItemsA ?? itemsA,
      cue: {
        color: dataA.get('cue')?.color ?? 'white',
        start: dataA.get('cue')?.start ?? dataA.get('start'),
        end: (alignedItemsA ?? itemsA)[itemsA.length - 1].end,
      },
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

  const { items, start, end } = block.getData().toJS();

  if (
    contentState.getBlockForKey(blockKey) &&
    contentState.getBlockForKey(blockKey).getText() !== text &&
    items &&
    items.length > 2 &&
    text.split(' ').length > 2
  ) {
    blockAligners.current[blockKey] &&
      window.cancelIdleCallback(blockAligners.current[blockKey]) &&
      delete blockAligners.current[blockKey];

    blockAligners.current[blockKey] = window.requestIdleCallback(
      () =>
        aligner(items, text, start, end, alignedItems => {
          const data = {
            block: block.getData().get('block'), // TBD: do we need this?
            speaker: block.getData().get('speaker'),
            items: alignedItems,
            start: alignedItems?.[0]?.start ?? start,
            end: alignedItems?.[alignedItems.length - 1]?.end ?? end,
            prealign: { items, start, end },
          };

          console.log('aligner', data);

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
        }),
      { timeout: 250 },
    );
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
