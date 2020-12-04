/* eslint-disable no-shadow */
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { DataStore } from '@aws-amplify/datastore';

import ReactPlayer from 'react-player';

import Layout from 'src/Layout';
import MediaForm from 'src/features/MediaForm';
import { Media } from 'src/models';

const getMedia = async (setMedia, id) => {
  const media = await DataStore.query(Media, id);
  if (!Array.isArray(media)) setMedia(media);
};

const MediaPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [media, setMedia] = useState({});
  useEffect(() => getMedia(setMedia, id), [setMedia, id]);

  const { title, description, transcripts = [], url } = media;

  const onMediaUpdate = ({ title, description, tags, channels }) => {
    console.log({ title, tags, channels, description });
  };

  return (
    <Layout>
      <h1>{title}</h1>
      <p>{description}</p>
      <ReactPlayer url={url} controls />
      <MediaForm allChannels={[]} allTags={[]} data={{ url, title, description }} onSubmit={onMediaUpdate} />
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
