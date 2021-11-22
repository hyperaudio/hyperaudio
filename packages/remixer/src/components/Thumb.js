import React from 'react';

import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import CardActionArea from '@mui/material/CardActionArea';
import { styled } from '@mui/material/styles';

const PREFIX = 'Thumb';
const classes = {
  title: `${PREFIX}-title`,
  actionArea: `${PREFIX}-actionArea`,
};
const Root = styled(Card, {
  shouldForwardProp: prop => prop !== 'isActive',
})(({ theme, isActive }) => ({
  background: isActive ? theme.palette.primary.main : 'auto',
  // boxShadow: `0 0px 0px 5px ${isActive ? theme.palette.primary.main : 'transparent'}`,
  color: isActive ? theme.palette.primary.contrastText : theme.palette.primary.dark,
  outline: `5px solid ${isActive ? theme.palette.primary.main : 'transparent'}`,
  transitionDuration: theme.transitions.duration.standard,
  transitionProperty: 'background, background-color, outline, color',
  [`&:hover`]: {
    background: isActive ? theme.palette.primary.main : theme.palette.primary.offwhite,
    color: isActive ? theme.palette.primary.contrastText : theme.palette.primary.dark,
    outline: isActive ? `5px solid ${theme.palette.primary.main}` : `5px solid ${theme.palette.primary.offwhite}`,
  },
  [`& img`]: {
    position: 'relative',
    width: '100%',
  },
  [`& .${classes.title}`]: {
    padding: theme.spacing(0.5, 0, 0),
  },
  [`& .MuiCardActionArea-focusHighlight`]: {
    display: 'none',
  },
}));

export const Thumb = props => {
  const { isActive, onClick, title, img } = props;

  return (
    <Root elevation={0} isActive={isActive} onClick={!isActive ? onClick : null}>
      <CardActionArea disabled={isActive} className={classes.actionArea}>
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
