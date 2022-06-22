import React, { useRef, useState } from 'react';

// via https://github.com/mui-org/material-ui/issues/11723#issuecomment-893308915 & https://codesandbox.io/s/stoic-mcnulty-ux2l8?file=/src/App.tsx

import Grow from '@mui/material/Grow';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import { styled } from '@mui/material/styles';

const StyledMenuItem = styled(MenuItem, {
  shouldForwardProp: prop => prop !== 'isActive',
})(({ theme, isActive }) => ({
  background: isActive ? theme.palette.action.hover : 'transparent',
}));

export function RecursiveMenuItem({ MenuListProps, ...props }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  return (
    <StyledMenuItem
      {...props}
      isActive={open}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      ref={ref}
    >
      {props.label}
      <Popper anchorEl={ref.current} open={open} placement={props.placement ?? 'right'}>
        <Grow appear={open} in={open}>
          <Paper elevation={12}>
            <MenuList {...MenuListProps}>{props.children}</MenuList>
          </Paper>
        </Grow>
      </Popper>
    </StyledMenuItem>
  );
}
