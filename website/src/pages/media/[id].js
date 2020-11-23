/* eslint-disable no-shadow */
import { useRouter } from 'next/router';
import useSWR from 'swr';
import axios from 'axios';

import ReactPlayer from 'react-player';

import Layout from 'src/Layout';

const fetcher = (url) => axios.get(url).then((res) => res.data);

const MediaPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data = {}, error } = useSWR(`/api/v2/media/${id}`, fetcher);
  if (error) return <h1>BOOM</h1>;

  const { title, description, transcripts, source: { url } = {} } = data;

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

// TODO
// export async function getStaticProps() {
//   // `getStaticProps` is invoked on the server-side,
//   // so this `fetcher` function will be executed on the server-side.
//   const initialData = await fetcher('/api/v2/media'); +id?
//   return { props: { initialData } };
// }

export default MediaPage;
