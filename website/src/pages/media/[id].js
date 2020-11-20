import { useRouter } from 'next/router';
import useSWR from 'swr';
import axios from 'axios';

const fetcher = (url) => axios.get(url).then((res) => res.data);

const MediaPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data = {}, error } = useSWR(`/api/v2/media/${id}`, fetcher);
  if (error) return <h1>BOOM</h1>;

  const { label, desc, transcripts } = data;
  return (
    <>
      <h1>{label}</h1>
      <p>{desc}</p>
      <hr />
      {transcripts ? transcripts.map(({ label: l }) => <p>{l}</p>) : <h6>loading</h6>}
    </>
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
