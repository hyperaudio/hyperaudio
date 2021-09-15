import React from 'react';

import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Link from '@mui/material/Link';
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

const Tab = styled(Link)(({ theme }) => ({
  borderRight: `1px solid ${theme.palette.divider}`,
  height: '100%',
  padding: theme.spacing(0.7, 1),
}));

const TabClose = styled(IconButton)(({ theme }) => ({
  height: theme.spacing(2),
  marginLeft: theme.spacing(0.25),
  marginRight: theme.spacing(0.5 * -1),
  width: theme.spacing(2),
}));

const TabCloseIcon = styled(CloseIcon)(({ theme }) => ({
  fontSize: '16px',
}));

export const Sources = ({ editable, sources, source }) => {
  return (
    <Root className="SourcesTabs">
      {sources.length > 1 ? (
        sources.map((obj, i) => (
          <Tab key={obj.id} variant="caption" underline="none">
            {obj.title}{' '}
            {editable && (
              <Tooltip title="Close">
                <TabClose size="small">
                  <TabCloseIcon />
                </TabClose>
              </Tooltip>
            )}
          </Tab>
        ))
      ) : (
        <>title</>
      )}
    </Root>
  );
};
