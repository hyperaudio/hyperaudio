import React from 'react';

import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
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

const Tab = styled(Button)(({ theme }) => ({
  borderRadius: 0,
  borderRight: `1px solid ${theme.palette.divider}`,
  flexBasis: 'auto',
  flexGrow: 1,
  flexShrink: 0,
  justifyContent: 'space-between',
  minHeight: theme.spacing(5),
  textTransform: 'none',
  width: 'auto',
}));

const TabText = styled(Typography)(({ theme }) => ({
  maxWidth: '150px',
}));

const TabCloseIcon = styled(CloseIcon)(({ theme }) => ({
  fontSize: '16px',
}));

export const Sources = ({ editable, sources, source }) => {
  return (
    <Root className="SourcesTabs">
      {sources.map((obj, i) => (
        <Tab
          key={obj.id}
          variant="caption"
          underline="none"
          endIcon={
            editable ? (
              <Tooltip title="Close">
                <IconButton size="small" edge="end">
                  <TabCloseIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            ) : null
          }
        >
          <TabText variant="caption" noWrap>
            {obj.title}
          </TabText>
        </Tab>
      ))}
    </Root>
  );
};
