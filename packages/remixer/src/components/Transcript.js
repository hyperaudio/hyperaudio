import React, { useCallback, useMemo } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';

import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import { styled } from '@mui/material/styles';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

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

const DragBlock = styled('div')(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  position: 'relative',
  [`&:hover`]: {
    backgroundColor: theme.palette.background.paper,
    outline: `1px solid ${theme.palette.divider}`,
  },
}));

const DragHandle = styled(IconButton)(({ theme }) => ({
  marginRight: theme.spacing(1),
  opacity: 0.5,
  position: 'absolute',
  right: '100%',
  top: theme.spacing(0.7),
  [`&:hover`]: {
    opacity: 1,
  },
}));

const Section = styled('p')(({ theme }) => ({
  // transitionDuration: `${theme.transitions.duration.short}s`, // TODO: figure out why transitions have no effect
  // transitionProperty: 'background-color',
  // transitionTimingFunction: 'ease-in',
  color: theme.palette.text.secondary,
  margin: theme.spacing(0),
  padding: theme.spacing(1),
  [`& span.playhead`]: {
    color: theme.palette.primary.main,
  },
  [`&:before`]: {
    ...theme.typography.overline,
    backgroundColor: theme.palette.divider,
    borderRadius: theme.shape.borderRadius,
    color: `${theme.palette.text.disabled}`,
    content: `attr(data-speaker)`,
    lineHeight: 0,
    marginRight: theme.spacing(0.66),
    padding: theme.spacing(0.3, 0.5),
  },
  [`&.past, &.past:before`]: {
    color: theme.palette.text.primary,
  },
  [`&.present:before, & span.playhead span`]: {
    color: theme.palette.primary.dark,
  },
  [`&.future`]: {
    color: theme.palette.text.disabled,
  },
}));

export const Transcript = props => {
  const { id, blocks, reference, time, editable, isSource = false } = props;

  const handleClick = useCallback(
    ({ target }) => {
      const selection = window.getSelection();
      console.log(target, selection);
      if (!selection.isCollapsed || !target.getAttribute('data-key') || !target.getAttribute('data-media')) return;

      const { anchorOffset } = selection;
      // const media = target.getAttribute('data-media');
      const key = target.getAttribute('data-key');
      const textOffset = parseInt(target.getAttribute('data-text-offset') ?? 0);
      const offset = parseInt(target.getAttribute('data-offset') ?? 0);

      // console.log(media, key, blocks);

      const block = blocks.find(block => block.key === key);
      const index = block.offsets.findIndex(
        (offset, i) => offset <= anchorOffset + textOffset && anchorOffset + textOffset <= offset + block.lengths[i],
      );

      // console.log(block, index);

      const time = index > 0 ? block.starts2[index] + offset : offset;

      if (reference.current) reference.current.currentTime = time / 1e3;
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
                {provided.placeholder}
                {blocks?.map((block, i) => (
                  <Draggable key={block.key} draggableId={`draggable-${id}-${block.key}`} index={i}>
                    {(provided, snapshot) => (
                      <DragBlock ref={provided.innerRef} {...provided.draggableProps}>
                        <DragHandle {...provided.dragHandleProps} color="default" size="small">
                          <DragIndicatorIcon fontSize="small" />
                        </DragHandle>
                        <Block key={block.key} blocks={blocks} block={block} time={time} />
                      </DragBlock>
                    )}
                  </Draggable>
                ))}
              </div>
            )}
          </Droppable>
        ) : (
          blocks?.map((block, i) => <Block key={block.key} blocks={blocks} block={block} time={time} />)
        )}
      </Container>
    </Root>
  );
};

const Block = ({ blocks, block, time }) => {
  const { key, pk, speaker, text, duration } = block;

  const offset = useMemo(() => {
    const index = blocks.findIndex(b => b === block);

    return blocks.slice(0, index).reduce((acc, b) => acc + b.duration + b.gap, 0);
  }, [blocks, block]);

  return (
    <Section
      data-media={pk}
      data-key={key}
      data-offset={offset}
      data-text-offset={0}
      data-speaker={`${speaker}:`}
      className={`${time >= offset + duration ? 'past' : 'future'} ${
        time >= offset && time < offset + duration ? 'present' : ''
      }`}
    >
      {time >= offset && time < offset + duration ? <Playhead block={block} offset={offset} time={time} /> : text}
    </Section>
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
