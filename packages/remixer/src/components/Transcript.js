import React, { useCallback, useMemo } from 'react';

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
  padding: theme.spacing(6, 2, 18, 2),
}));

export const Transcript = props => {
  const { blocks, players, reference, time } = props;

  const handleClick = useCallback(
    ({ target }) => {
      const selection = window.getSelection();
      if (!selection.isCollapsed || !target.getAttribute('data-key') || !target.getAttribute('data-media')) return;

      const { anchorOffset } = selection;
      const media = target.getAttribute('data-media');
      const key = target.getAttribute('data-key');

      // console.log(media, key, blocks);

      const block = blocks.find(block => block.key === key);
      const index = block.offsets.findIndex(
        (offset, i) => offset <= anchorOffset && anchorOffset <= offset + block.lengths[i],
      );

      // console.log(block, index);

      const time = index > 0 ? block.starts[index] : block.start;

      if (reference.current) reference.current.currentTime = time / 1e3;
    },
    [blocks],
  );

  return (
    <Root>
      <Container maxWidth="sm" onClick={handleClick}>
        {blocks?.map(block => (
          <Block key={block.key} blocks={blocks} block={block} time={time} />
        ))}
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
        `}</style>
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
    <p
      data-media={pk}
      data-key={key}
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
      <span className="playhead">
        {block.text.substring(0, start)}
        <span>{block.text.substring(start, end)}</span>
      </span>
      {block.text.substring(end)}
    </>
  );
};
