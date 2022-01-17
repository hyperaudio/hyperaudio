import React from 'react';

import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

const PREFIX = 'Thumb';
const classes = {
  title: `${PREFIX}-title`,
  actionArea: `${PREFIX}-actionArea`,
};
const Root = styled(Card, {
  shouldForwardProp: prop => prop !== 'isActive',
})(({ theme, isActive }) => ({
  background: isActive ? theme.palette.primary.main : 'transparent',
  // boxShadow: `0 0px 0px 5px ${isActive ? theme.palette.primary.main : 'transparent'}`,
  color: isActive ? theme.palette.primary.contrastText : theme.palette.primary.dark,
  outline: `3px solid ${isActive ? theme.palette.primary.main : 'transparent'}`,
  transitionDuration: theme.transitions.duration.short,
  transitionProperty: 'background, background-color, outline, color',
  [`&:hover`]: {
    background: isActive ? theme.palette.primary.main : theme.palette.primary.light,
    color: isActive ? theme.palette.primary.contrastText : theme.palette.primary.dark,
    outline: isActive ? `3px solid ${theme.palette.primary.main}` : `3px solid ${theme.palette.primary.light}`,
  },
  [`& img`]: {
    display: 'inline-block',
    position: 'relative',
    width: '100%',
  },
  [`& .${classes.title}`]: {
    margin: theme.spacing(0.5, 0, 0),
    padding: theme.spacing(0, 0.5),
  },
  [`& .MuiCardActionArea-focusHighlight`]: {
    display: 'none',
  },
  [`& .${classes.actionArea}`]: {
    lineHeight: 0,
  },
}));

export const Thumb = props => {
  const { isActive, onClick, title, img, height, width } = props;

  return (
    <Root elevation={0} isActive={isActive} onClick={!isActive ? onClick : null}>
      <CardActionArea disabled={isActive} className={classes.actionArea}>
        <img alt={`Poster image for ${title}`} src={img} height={`${height}px`} width={`${width}px`} />
        {title && (
          <Tooltip enterDelay={1500} title={title}>
            <Typography display="block" noWrap variant="caption" className={classes.title}>
              {title}
            </Typography>
          </Tooltip>
        )}
      </CardActionArea>
    </Root>
  );
};
