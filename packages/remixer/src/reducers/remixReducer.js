/* eslint-disable no-case-declarations */
import { arrayMoveImmutable } from 'array-move';

const remixReducer = (state, action) => {
  const { type, event: { draggableId, source, destination } = {} } = action;

  switch (type) {
    case 'sourceOpen':
      // TODO deal with sources/library via API
      let sources = state.sources;
      let tabs = state.tabs;
      if (!sources.find(s => s.id === action.source.id)) sources = [...state.sources, action.source];
      if (!tabs.find(s => s.id === action.source.id)) tabs = [...state.tabs, action.source];
      return { ...state, sources, tabs, source: action.source };
    case 'sourceClose':
      return {
        ...state,
        source: state.tabs.filter(source => source.id !== action.id)[0],
        tabs: state.tabs.filter(source => source.id !== action.id),
      };
    case 'removeBlock':
      return { ...state, remix: { ...state.remix, blocks: state.remix.blocks.filter(b => b.key !== action.key) } };
    case 'moveUpBlock': {
      const index = state.remix.blocks.findIndex(b => b.key === action.key);
      return {
        ...state,
        remix: { ...state.remix, blocks: arrayMoveImmutable(state.remix.blocks, index, index - 1) },
      };
    }
    case 'moveDownBlock': {
      const index = state.remix.blocks.findIndex(b => b.key === action.key);
      return {
        ...state,
        remix: { ...state.remix, blocks: arrayMoveImmutable(state.remix.blocks, index, index + 1) },
      };
    }
    case 'titleSetFullSize': {
      const index = state.remix.blocks.findIndex(b => b.key === action.key);
      const block = state.remix.blocks[index];
      console.log(index, block);
      return {
        ...state,
        remix: {
          ...state.remix,
          blocks: [
            ...state.remix.blocks.slice(0, index),
            { ...block, fullSize: action.fullSize },
            ...state.remix.blocks.slice(index + 1),
          ],
        },
      };
    }
    case 'titleTextChange': {
      const index = state.remix.blocks.findIndex(b => b.key === action.key);
      const block = state.remix.blocks[index];
      console.log(index, block);
      return {
        ...state,
        remix: {
          ...state.remix,
          blocks: [
            ...state.remix.blocks.slice(0, index),
            { ...block, text: action.text },
            ...state.remix.blocks.slice(index + 1),
          ],
        },
      };
    }
    case 'transitionDurationChange': {
      const index = state.remix.blocks.findIndex(b => b.key === action.key);
      const block = state.remix.blocks[index];
      console.log(index, block);
      return {
        ...state,
        remix: {
          ...state.remix,
          blocks: [
            ...state.remix.blocks.slice(0, index),
            { ...block, transition: action.transition },
            ...state.remix.blocks.slice(index + 1),
          ],
        },
      };
    }
    case 'slidesChange': {
      const index = state.remix.blocks.findIndex(b => b.key === action.key);
      const block = state.remix.blocks[index];
      console.log(index, block);
      return {
        ...state,
        remix: {
          ...state.remix,
          blocks: [
            ...state.remix.blocks.slice(0, index),
            { ...block, deck: action.deck, slide: action.slide },
            ...state.remix.blocks.slice(index + 1),
          ],
        },
      };
    }
    case 'appendInsert': {
      const { insert } = action;
      const index = state.remix.blocks.findIndex(b => b.key === action.key) + 1;
      return {
        ...state,
        remix: {
          ...state.remix,
          blocks: [
            ...state.remix.blocks.slice(0, index),
            {
              key: `${insert}-${Date.now()}`,
              duration: 0,
              gap: 0,
              type: insert,
            },
            ...state.remix.blocks.slice(index),
          ],
        },
      };
    }
    case 'dragEnd': {
      const sourceId = source?.droppableId?.split(':').pop();
      const remixId = destination?.droppableId?.split(':').pop();
      if (destination && draggableId.indexOf(`draggable:${remixId}`) === 0) {
        const blocks = arrayMoveImmutable(state.remix.blocks, source.index, destination.index);
        return { ...state, remix: { ...state.remix, blocks } };
      } else if (sourceId === '$toolbar') {
        const type = draggableId.split(':').pop().substring(1);

        return {
          ...state,
          remix: {
            ...state.remix,
            blocks: [
              ...state.remix.blocks.slice(0, destination.index),
              {
                key: `${type}-${Date.now()}`,
                duration: 0,
                gap: 0,
                type,
              },
              ...state.remix.blocks.slice(destination.index),
            ],
          },
        };
      } else if (sourceId) {
        const range = draggableId
          .split(':')
          .pop()
          .split('-')
          .map(v => parseInt(v, 10));

        console.log(range);

        const sourceBlocks = state.sources.find(({ id }) => id === sourceId).blocks;

        const sourceSelectedBlocks = sourceBlocks
          .filter((block, i, arr) => {
            const offset = sourceBlocks.slice(0, i).reduce((acc, block) => acc + block.duration + block.gap, 0);

            return (
              (offset <= range[0] && range[0] < offset + block.duration) ||
              (range[0] <= offset && offset + block.duration < range[1]) ||
              (offset <= range[1] && range[1] < offset + block.duration)
            );
          })
          .map((block, i, arr) => {
            const sourceIndex = sourceBlocks.findIndex(b => b === block);
            const offset = sourceBlocks
              .slice(0, sourceIndex)
              .reduce((acc, block) => acc + block.duration + block.gap, 0);

            const startIndex = block.starts2.findIndex((s, i) => offset + s >= range[0]);
            const endIndex = block.starts2.findIndex((s, i) => offset + s + block.durations[i] >= range[1]);

            console.log({ startIndex, endIndex, offset, text: block.text, block });

            let startIndex2 = startIndex;
            let endIndex2 = endIndex;

            if (startIndex === -1) startIndex2 = 0;
            if (endIndex === -1) endIndex2 = block.starts2.length - 1;

            return {
              ...block,
              key: `${block.key}-${Date.now()}`, // TODO: better random key
              text: block.text.substring(
                startIndex === -1 ? 0 : block.offsets[startIndex],
                endIndex === -1
                  ? block.text.length
                  : block.offsets[endIndex < block.offsets.length - 2 ? endIndex + 1 : endIndex] +
                      block.lengths[endIndex < block.offsets.length - 2 ? endIndex + 1 : endIndex],
              ),
              starts: block.starts.slice(startIndex2, endIndex2),
              starts2: block.starts2.slice(startIndex2, endIndex2),
              ends: block.ends.slice(startIndex2, endIndex2),
              ends2: block.ends2.slice(startIndex2, endIndex2),
              offsets: block.offsets.slice(startIndex2, endIndex2),
              lengths: block.lengths.slice(startIndex2, endIndex2),
              keys: block.keys.slice(startIndex2, endIndex2),
              durations: block.durations.slice(startIndex2, endIndex2),
              // start: block.starts.slice(startIndex2, endIndex2)[0],
              // end: block.ends.slice(startIndex2, endIndex2)[endIndex2 - startIndex2],
              duration:
                block.ends2.slice(startIndex2, endIndex2).pop() - block.starts2.slice(startIndex2, endIndex2)[0],
              gap: endIndex === -1 ? block.gap : 0,
              debug: { block, range, startIndex, endIndex, startIndex2, endIndex2 },
            };
          });

        return {
          ...state,
          remix: {
            ...state.remix,
            blocks: [
              ...state.remix.blocks.slice(0, destination.index),
              ...sourceSelectedBlocks,
              ...state.remix.blocks.slice(destination.index),
            ],
          },
        };
      }
      return state;
    }
    default:
      throw new Error(`unhandled action ${type}`, action);
  }
};

export default remixReducer;
