import React from 'react';
import { useRouter } from 'next/router';

import Remixer from '@hyperaudio/remixer';

import { remixData } from './data';

const MediaPage = () => {
  const router = useRouter();
  const { slug } = router.query;

  console.group('Hello Media Page');
  console.log({ slug });
  console.groupEnd();

  return (
    <Remixer editable={false} isSingleMedia={true} media={remixData.sources} remix={null} sources={remixData.sources} />
  );
};

export default MediaPage;
