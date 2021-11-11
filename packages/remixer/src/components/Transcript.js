import React, { useCallback, useMemo, useState } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';

import Container from '@mui/material/Container';
import { styled } from '@mui/material/styles';

const Root = styled('div')(({ theme }) => ({
  alignItems: 'center',
  borderTop: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  flex: '2 2 66%',
  flexFlow: 'column nowrap',
  justifyContent: 'flex-start',
  overflow: 'auto',
  padding: theme.spacing(4, 2, 18, 2),
}));

export const Transcript = props => {
  const { id, blocks, reference, time, editable, isSource = false } = props;
  const [range, setRange] = useState();

  const handleClick = useCallback(
    ({ target }) => {
      const selection = window.getSelection();
      console.log(target, selection);

      const { anchorOffset, focusOffset, anchorNode, focusNode } = selection;

      if (selection.isCollapsed && target.getAttribute('data-key')) {
        const key = target.getAttribute('data-key');
        const textOffset = parseInt(target.getAttribute('data-text-offset') ?? 0);
        const offset = parseInt(target.getAttribute('data-offset') ?? 0);

        const block = blocks.find(block => block.key === key);
        const index = block.offsets.findIndex(
          (offset, i) => offset <= anchorOffset + textOffset && anchorOffset + textOffset <= offset + block.lengths[i],
        );

        const time = index > 0 ? block.starts2[index] + offset : offset;
        if (reference.current) reference.current.currentTime = time / 1e3;
      } else if (!selection.isCollapsed && editable && isSource) {
        const key = anchorNode?.parentNode?.getAttribute('data-key');
        const textOffset = parseInt(anchorNode?.parentNode?.getAttribute('data-text-offset') ?? 0);
        const offset = parseInt(anchorNode?.parentNode?.getAttribute('data-offset') ?? 0);

        const block = blocks.find(block => block.key === key);
        const index = block.offsets.findIndex(
          (offset, i) => offset <= anchorOffset + textOffset && anchorOffset + textOffset <= offset + block.lengths[i],
        );

        const time = index > 0 ? block.starts2[index] + offset : offset;

        const key2 = focusNode?.parentNode?.getAttribute('data-key');
        const textOffset2 = parseInt(focusNode?.parentNode?.getAttribute('data-text-offset') ?? 0);
        const offset2 = parseInt(focusNode?.parentNode?.getAttribute('data-offset') ?? 0);

        const block2 = blocks.find(block => block.key === key2);
        const index2 = block2.offsets.findIndex(
          (offset, i) =>
            offset2 <= focusOffset + textOffset2 && focusOffset + textOffset2 <= offset2 + block2.lengths[i],
        );

        const time2 = index2 > 0 ? block2.starts2[index2] + offset2 : offset2;

        console.log(block, index, time);
        console.log(block2, index2, time2);
        setRange([Math.min(time, time2), Math.max(time, time2)]);
      }
    },
    [blocks],
  );

  return (
    <Root>
      <Container maxWidth="sm" onClick={handleClick}>
        {editable && !isSource ? (
          <Droppable droppableId={`droppable-${id}`} type="BLOCK">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                style={
                  {
                    // backgroundColor: snapshot.isDraggingOver ? 'lightblue' : 'lightgrey',
                  }
                }
                {...provided.droppableProps}
              >
                {blocks?.map((block, i) => (
                  <Draggable key={block.key} draggableId={`draggable-${id}-${block.key}`} index={i}>
                    {(provided, snapshot) => (
                      <div ref={provided.innerRef} {...provided.draggableProps}>
                        <div className={'dragHandle'} {...provided.dragHandleProps} />
                        <Block key={block.key} {...{ blocks, block, time, range }} />
                      </div>
                    )}
                  </Draggable>
                ))}
              </div>
            )}
          </Droppable>
        ) : (
          blocks?.map((block, i) => <Block key={block.key} {...{ blocks, block, time, range }} />)
        )}
        <style scoped>{`
          p {
            color: darkgrey;
          }
          p.past {
            color: black;
          }
          p.present {
            outline: 1px solid lightgrey;
          }
          p.future {
            color: darkgrey;
          }
          p span.playhead {
            color: black;
          }
          p span.playhead span {
            color: teal;
          }
          p::before {
            content: attr(data-speaker);
            font-weight: bold;
          }
          p.present::before {
            color: black;
          }
          .dragHandle {
            float: left;
            width: 10px;
            height: 20px;
            background-color: red;
          }
        `}</style>
      </Container>
    </Root>
  );
};

// TODO: wrap range intersecting blocks with Draggable, keep copy mode, have draggable clone with the text only

const Block = ({ blocks, block, time, range }) => {
  const { key, pk, speaker, text, duration } = block;

  const offset = useMemo(() => {
    const index = blocks.findIndex(b => b === block);

    return blocks.slice(0, index).reduce((acc, b) => acc + b.duration + b.gap, 0);
  }, [blocks, block]);

  return (
    <p
      data-media={pk}
      data-key={key}
      data-offset={offset}
      data-text-offset={0}
      data-speaker={`${speaker}: `}
      className={`${time >= offset + duration ? 'past' : 'future'} ${
        time >= offset && time < offset + duration ? 'present' : ''
      }`}
    >
      {time >= offset && time < offset + duration ? <Playhead block={block} offset={offset} time={time} /> : text}
    </p>
  );
};

const Playhead = ({ block, offset, time }) => {
  const [start, end] = useMemo(() => {
    const index = block.starts2.findIndex((s, i) => offset + s + block.durations[i] > time);
    if (index === -1) return [block.text.length - 1, block.text.length - 1];

    return [block.offsets[index], block.offsets[index] + block.lengths[index]];
  }, [block, offset, time]);

  return (
    <>
      <span className="playhead" data-media={block.pk} data-key={block.key} data-text-offset={0} data-offset={offset}>
        {block.text.substring(0, start)}
        <span>{block.text.substring(start, end)}</span>
      </span>
      <span data-media={block.pk} data-key={block.key} data-text-offset={end} data-offset={offset}>
        {block.text.substring(end)}
      </span>
    </>
  );
};
