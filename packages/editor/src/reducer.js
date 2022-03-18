import { EditorState, SelectionState, Modifier } from 'draft-js';
import { Map } from 'immutable';

const blockAligners = {};

const processBlockJoin = (editorState, changedEditorState, aligner) => {
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

const deferAlignment = (changedEditorState, aligner, dispatch) => {
  if (!aligner) return;

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
          const contentStateWithBlockData = Modifier.setBlockData(
            changedContentState,
            SelectionState.createEmpty(blockKey),
            Map({
              block: block.getData().get('block'),
              speaker: block.getData().get('speaker'),
              items: alignedItems,
              start,
              end,
              // prealign: { items, start, end },
            }), // have prealign data as debug
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

export const reducer = (editorState, { type, editorState: changedEditorState, aligner, dispatch }) => {
  const contentState = editorState.getCurrentContent();
  const changedContentState = changedEditorState.getCurrentContent();

  const join = changedContentState.getBlockMap().size < contentState.getBlockMap().size;
  const split = changedContentState.getBlockMap().size > contentState.getBlockMap().size;

  switch (type) {
    case 'insert-characters':
      deferAlignment(changedEditorState, aligner, dispatch);
      return editorState;
    case 'remove-range':
      return join ? processBlockJoin(editorState, changedEditorState, aligner) : editorState;
    case 'backspace-character':
      return join ? processBlockJoin(editorState, changedEditorState, aligner) : editorState;
    case 'delete-character':
      return join ? processBlockJoin(editorState, changedEditorState, aligner) : editorState;
    case 'split-block':
      return split ? processBlockSplit(editorState, changedEditorState, aligner) : editorState;
    case 'change-block-data':
      return editorState;
    default:
      deferAlignment(changedEditorState, aligner, dispatch);
      return editorState;
  }
};
