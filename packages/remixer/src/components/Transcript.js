import React, { useCallback } from 'react';

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

  // console.group('Transcript');
  // console.log('blocks', blocks);
  // console.groupEnd();

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

      // console.log(time, players.current, players.current?.[media]);

      if (reference.current) reference.current.currentTime = time / 1e3;
    },
    [blocks],
  );

  return (
    <Root>
      <Container maxWidth="sm" onClick={handleClick}>
        {blocks?.map(({ key, pk, sk, speaker, text }) => (
          <p key={key} data-media={pk} data-key={key} data-speaker={`${speaker}: `}>
            {text}
          </p>
        ))}
        <style scoped>{'p::before { content: attr(data-speaker); font-weight: bold; }'}</style>
      </Container>
    </Root>
  );
};
