import React from 'react';

import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import CardActionArea from '@mui/material/CardActionArea';
import { styled } from '@mui/material/styles';

const PREFIX = 'Thumb';
const classes = {
  title: `${PREFIX}-title`,
};
const Root = styled(Card, {
  shouldForwardProp: prop => prop !== 'isActive',
})(({ theme, isActive }) => ({
  background: isActive ? theme.palette.primary.main : 'auto',
  boxShadow: `0 0px 0px 5px ${isActive ? theme.palette.primary.main : 'transparent'}`,
  color: isActive ? theme.palette.primary.contrastText : theme.palette.primary.dark,
  transitionDuration: theme.transitions.duration.standard,
  transitionProperty: 'background, background-color, box-shadow, color',
  [`&:hover`]: {
    background: theme.palette.primary.main,
    boxShadow: `0 0px 0px 5px ${theme.palette.primary.main}`,
    color: theme.palette.primary.contrastText,
  },
  [`& img`]: {
    position: 'relative',
    width: '100%',
  },
  [`& .${classes.title}`]: {
    padding: theme.spacing(0.5, 0, 0),
  },
}));

export const Thumb = props => {
  const { isActive, onClick, title, img } = props;

  return (
    <Root elevation={0} isActive={isActive} onClick={!isActive ? onClick : null}>
      <CardActionArea disabled={isActive}>
        <img alt={`Poster image for ${title}`} src={img} />
        <Tooltip enterDelay={1500} title={title}>
          <Typography display="block" noWrap variant="caption">
            {title}
          </Typography>
        </Tooltip>
      </CardActionArea>
    </Root>
  );
};
