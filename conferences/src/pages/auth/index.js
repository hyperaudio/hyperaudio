import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

const Redirect = () => {
  const router = useRouter();
  const {
    query: { redirect = '/' },
  } = router;

  useEffect(() => {
    setTimeout(() => router.push(redirect), 3000); // FIXME no need to wait for 3 seconds
  }, [redirect, router]);

  return (
    <p>
      Redirecting to <a href={redirect}>{redirect}</a>
    </p>
  );
};

const AuthPage = () => {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <div>
          {user.username}
          <Redirect />
        </div>
      )}
    </Authenticator>
  );
};

export default AuthPage;
