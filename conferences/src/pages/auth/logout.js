import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Auth } from 'aws-amplify';

const Logout = () => {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      await Auth.signOut({ global: true });
      setTimeout(() => router.push('/'), 1000);
    })();
  });

  return <h1>logged out</h1>;
};

export default Logout;
