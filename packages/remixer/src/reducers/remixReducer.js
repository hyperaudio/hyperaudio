/* eslint-disable no-case-declarations */
import { arrayMoveImmutable, arrayMoveMutable } from 'array-move';

const remixReducer = (state, action) => {
  const { type, event: { draggableId, source, destination } = {} } = action;

  switch (type) {
    case 'sourceOpen':
      return { ...state, sources: [...state.sources, action.source] };
    case 'sourceClose':
      return { ...state, sources: state.sources.filter(source => source.id !== action.id) };
    case 'dragEnd':
      const sourceId = source?.droppableId?.split(':').pop();
      const remixId = destination?.droppableId?.split(':').pop();
      if (destination && draggableId.indexOf(`draggable:${remixId}`) === 0) {
        const blocks = arrayMoveImmutable(state.remix.blocks, source.index, destination.index);
        return { ...state, remix: { ...state.remix, blocks } };
      } else if (sourceId === '$toolbar') {
        console.log('TODO toolbar');
      } else if (sourceId) {
        const range = draggableId
          .split(':')
          .pop()
          .split('-')
          .map(v => parseInt(v, 10));

        console.log(range);

        const sourceBlocks = state.sources
          .find(({ id }) => id === sourceId)
          .blocks.filter((block, i, arr) => {
            const offset = arr.slice(0, i).reduce((acc, block) => acc + block.duration + block.gap, 0);
            return (
              (offset <= range[0] && range[0] < offset + block.duration) ||
              (range[0] <= offset && offset + block.duration < range[1]) ||
              (offset <= range[1] && range[1] < offset + block.duration)
            );
          });

        return {
          ...state,
          remix: {
            ...state.remix,
            blocks: [
              ...state.remix.blocks.slice(0, destination.index),
              ...sourceBlocks,
              ...state.remix.blocks.slice(destination.index),
            ],
          },
        };
      }
      return state;
    default:
      throw new Error('unhandled action', action);
  }
};

export default remixReducer;
