import React from 'react';

const PlayheadSpan = props => (
  <span className="Playhead" style={{ fontWeight: 'bold' }}>
    {props.children}
  </span>
);

const PlayheadDecorator = {
  strategy: (contentBlock, callback, contentState, time = 0) => {
    const { start, end, items } = contentBlock.getData().toJS();

    if (start <= time && time < end) {
      const item = items?.filter(({ start }) => start <= time).pop();
      if (!item) return;

      callback(item.offset, item.offset + item.length);
    }
  },
  component: PlayheadSpan,
};

export default PlayheadDecorator;
