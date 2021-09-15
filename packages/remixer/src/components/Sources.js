import React from 'react';

import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

const Root = styled('div')(({ theme }) => ({
  alignItems: 'center',
  display: 'flex',
  flexFlow: 'row',
  justifyContent: 'flex-start',
  maxWidth: 'inherit',
  overflowX: 'auto',
  whiteSpace: 'nowrap',
}));

const Tab = styled('a')(({ theme }) => ({}));

export const Sources = ({ sources, source }) => {
  return (
    <Root className="SourcesTabs">
      {sources.length > 1 ? (
        <>
          {sources.map((obj, i) => {
            return (
              <Tab
                className="SourceTab"
                endIcon={<IconButton size="small">I</IconButton>}
                key={obj.id}
                size="small"
                variant="text"
              >
                {obj.title}
              </Tab>
            );
          })}
        </>
      ) : (
        <>title</>
      )}
    </Root>
  );
};
