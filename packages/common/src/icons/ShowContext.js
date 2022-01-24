import React from 'react';

import SvgIcon from '@mui/material/SvgIcon';

export const ShowContextIcon = props => {
  return (
    <SvgIcon {...props}>
      <path d="M5,15 L3,15 L3,19 C3,20.1 3.9,21 5,21 L9,21 L9,19 L5,19 L5,15 Z M5,5 L9,5 L9,3 L5,3 C3.9,3 3,3.9 3,5 L3,9 L5,9 L5,5 Z M19,3 L15,3 L15,5 L19,5 L19,9 L21,9 L21,5 C21,3.9 20.1,3 19,3 Z M19,19 L15,19 L15,21 L19,21 C20.1,21 21,20.1 21,19 L21,15 L19,15 L19,19 Z" />
    </SvgIcon>
  );
};
