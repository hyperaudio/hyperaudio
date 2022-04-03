import React from 'react';

import { styled } from '@mui/material/styles';

const PREFIX = 'Playhead';
const classes = {
  root: `${PREFIX}`,
};

const Root = styled('span')(({ theme }) => ({
  color: theme.palette.primary.dark,
  textShadow: `-0.03ex 0 0 currentColor, 0.03ex 0 0 currentColor, 0 -0.02ex 0 currentColor, 0 0.02ex 0 currentColor`,
  transition: `all ${theme.transitions.duration.standard}`,
}));

const PlayheadSpan = props => {
  return <Root className={classes.root}>{props.children}</Root>;
};

const PlayheadDecorator = {
  strategy: (contentBlock, callback, contentState, time = 0, autoScroll = false) => {
    const { start, end, items } = contentBlock.getData().toJS();

    if (start <= time && time < end) {
      const item = items?.filter(({ start }) => start <= time).pop();
      if (!item) return;

      if (autoScroll)
        setTimeout(
          () =>
            document
              .querySelector(`div[data-block='true'][data-offset-key="${contentBlock.getKey()}-0-0"]`)
              .scrollIntoView({ behavior: 'smooth', block: 'start' }),
          0,
        );

      callback(item.offset, item.offset + item.length);
    }
  },
  component: PlayheadSpan,
};

export default PlayheadDecorator;
