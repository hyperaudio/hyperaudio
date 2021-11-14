import React from 'react';

import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

import { FullSizeIcon, LowerThirdsIcon } from '../icons';

const PREFIX = 'InsertTitle';
const classes = {
  icon: `${PREFIX}-icon`,
  field: `${PREFIX}-field`,
};

const Root = styled(Paper)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1),
}));

const Canvas = styled('div', {
  shouldForwardProp: prop => prop !== 'fullSize',
})(({ theme, fullSize }) => ({
  background: theme.palette.text.primary,
  color: theme.palette.primary.contrastText,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: fullSize ? 'center' : 'flex-end',
  minHeight: '120px',
  padding: theme.spacing(2),
  textAlign: 'center',
  [`& .${classes.field}`]: {
    [`& .MuiOutlinedInput-notchedOutline`]: {
      border: 'none',
    },
    input: {
      ...theme.typography.h6,
      border: 'none',
      color: theme.palette.primary.contrastText,
      textAlign: 'center',
    },
  },
}));

const Controls = styled('div')(({ theme }) => ({
  color: theme.palette.text.disabled,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1),
  [`& .${classes.icon}`]: {
    fontSize: '16px',
    lineHeight: 0,
    verticalAlign: 'middle',
    marginRight: theme.spacing(0.5),
  },
}));

const Control = styled('a', {
  shouldForwardProp: prop => prop !== 'isActive',
})(({ theme, isActive }) => ({
  color: isActive ? 'inherit' : theme.palette.primary.dark,
  cursor: 'pointer',
  display: 'inline-block',
  [`&:hover`]: {
    color: theme.palette.primary.main,
  },
}));

export const InsertTitle = props => {
  const { fullSize, text, onTextChange, onSetFullSize } = props;

  const [titleText, setTitleText] = React.useState(text);

  return (
    <Root>
      <Canvas fullSize={fullSize}>
        <TextField
          className={classes.field}
          onBlur={e => onTextChange(e.target.value)}
          onChange={e => setTitleText(e.target.value)}
          size="small"
          value={titleText}
        />
      </Canvas>
      <Controls>
        <Control isActive={fullSize} onClick={() => onSetFullSize(true)}>
          <FullSizeIcon className={classes.icon} />
          <Typography variant="caption" underline="hover">
            Full-size
          </Typography>
        </Control>{' '}
        ⋅ 
        <Control isActive={!fullSize} onClick={() => onSetFullSize(false)}>
          <LowerThirdsIcon className={classes.icon} />
          <Typography variant="caption" underline="hover">
            Lower-thirds
          </Typography>
        </Control>
      </Controls>
    </Root>
  );
};

InsertTitle.defaultProps = {
  text: 'Type in your title here…',
  fullSize: true,
};
