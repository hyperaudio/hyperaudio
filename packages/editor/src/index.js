import Draftjs, { EditorState, EditorBlock, convertFromRaw, convertToRaw, getVisibleSelectionRect } from 'draft-js';

import Editor from './Editor';

const flatten = list => list.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []);

const createEntityMap = blocks =>
  flatten(blocks.map(block => block.entityRanges)).reduce(
    (acc, data) => ({
      ...acc,
      [data.key]: { type: 'TOKEN', mutability: 'MUTABLE', data },
    }),
    {},
  );

export {
  Editor,
  EditorState,
  Draftjs,
  EditorBlock,
  getVisibleSelectionRect,
  convertFromRaw,
  convertToRaw,
  createEntityMap,
};
