/* eslint-disable no-shadow */
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { DataStore } from '@aws-amplify/datastore';

import ReactPlayer from 'react-player';

import Layout from 'src/Layout';
import { Media } from '../../models';

const getMedia = async (setMedia, id) => setMedia(await DataStore.query(Media, id));

const MediaPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [media, setMedia] = useState({});
  useEffect(() => getMedia(setMedia, id), [setMedia, id]);
  // console.log(media);

  const { title, description, transcripts = [], url } = media;

  return (
    <Layout>
      <h1>{title}</h1>
      <p>{description}</p>
      <ReactPlayer url={url} controls />
      <h6>Transcripts</h6>
      <ol>
        {transcripts ? (
          transcripts.map(({ id, title, type }) => (
            <li key={id}>
              {title} [{type}]
            </li>
          ))
        ) : (
          <h6>loading</h6>
        )}
      </ol>
    </Layout>
  );
};

export default MediaPage;
