import React from 'react';

import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
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

const Tab = styled(Button)(({ theme }) => ({
  borderRadius: 0,
  borderRight: `1px solid ${theme.palette.divider}`,
  flexBasis: '0',
  flexGrow: 1,
  flexShrink: 0,
  minHeight: theme.spacing(5),
  justifyContent: 'space-between',
  textTransform: 'none',
  width: 'auto',
}));

const TabText = styled(Typography)(({ theme }) => ({
  maxWidth: '150px',
}));

const TabClose = styled(IconButton)(({ theme }) => ({
  marginLeft: theme.spacing(0.5 * -1),
  marginRight: theme.spacing(0.5 * -1),
}));

const TabCloseIcon = styled(CloseIcon)(({ theme }) => ({
  fontSize: '16px',
}));

export const Sources = ({ editable, sources, source }) => {
  return (
    <Root className="SourcesTabs">
      {sources.length > 1 ? (
        sources.map((obj, i) => (
          <Tab
            key={obj.id}
            variant="caption"
            underline="none"
            endIcon={
              editable ? (
                <Tooltip title="Close">
                  <TabClose size="small">
                    <TabCloseIcon />
                  </TabClose>
                </Tooltip>
              ) : null
            }
          >
            <TabText variant="caption" noWrap>
              {obj.title}
            </TabText>
          </Tab>
        ))
      ) : (
        <>title</>
      )}
    </Root>
  );
};
