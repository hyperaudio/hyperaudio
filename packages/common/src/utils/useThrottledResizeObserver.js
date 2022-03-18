import _ from 'lodash';
import useResizeObserver from 'use-resize-observer/polyfilled';
import { useState, useMemo } from 'react';

export const useThrottledResizeObserver = wait => {
  const [size, setSize] = useState({ height: 0, width: 0 });
  const onResize = useMemo(() => _.throttle(setSize, wait), [wait]);
  const { ref } = useResizeObserver({ onResize, box: 'border-box', round: Math.floor });
  return { ref, ...size };
};
