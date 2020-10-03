import { useRouter } from 'next/router';

const Test = () => {
  const router = useRouter();
  const { id } = router.query;

  return <h1>TODO {id}</h1>;
};

export default Test;
