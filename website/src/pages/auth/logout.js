import React, { useEffect } from 'react';
import { Auth } from 'aws-amplify';

const Logout = () => {
  useEffect(async () => {
    await Auth.signOut({ global: true });
    // await Auth.signOut();
  });

  return <h1>logged out</h1>;
};

export default Logout;
