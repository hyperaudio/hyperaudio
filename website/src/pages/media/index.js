import axios from 'axios';
import useSWR from 'swr';

import Layout from 'src/Layout';

const fetcher = (url) => axios.get(url).then((res) => res.data);

const Media = ({ initialData }) => {
  const { data, error } = useSWR('/api/v2/media', fetcher, { initialData });
  if (error) return <h1>BOOM</h1>;

  return (
    <Layout>
      <h1>Media</h1>
      {data ? (
        data.map(({ _id, label }) => (
          <p>
            <a href={`/media/${_id}`}>{label}</a>
          </p>
        ))
      ) : (
        <h6>loading</h6>
      )}
    </Layout>
  );
};

// TODO
// export async function getStaticProps() {
//   // `getStaticProps` is invoked on the server-side,
//   // so this `fetcher` function will be executed on the server-side.
//   const initialData = await fetcher('/api/v2/media');
//   return { props: { initialData } };
// }

export default Media;
