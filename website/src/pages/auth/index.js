import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';

import {
  AmplifyAuthenticator,
  AmplifySignIn,
  AmplifySignUp,
  // AmplifyConfirmSignUp,
  // AmplifyConfirmSignIn,
  // AmplifyForgotPassword,
  // AmplifyRequireNewPassword,
} from '@aws-amplify/ui-react';

const Redirect = () => {
  const router = useRouter();
  const {
    query: { redirect = '/' },
  } = router;

  useEffect(() => {
    router.push(redirect);
  }, [redirect]);

  return (
    <p>
      Redirecting to <a href={redirect}>{redirect}</a>
    </p>
  );
};

const AuthPage = () => {
  const [authState, setAuthState] = useState();
  const [user, setUser] = useState();

  useEffect(() => {
    onAuthUIStateChange((nextAuthState, authData) => {
      setAuthState(nextAuthState);
      setUser(authData);
    });
  }, []);

  return authState === AuthState.SignedIn && user ? (
    <Redirect />
  ) : (
    <>
      <style>
        {`
          :root {
            --amplify-primary-color: #0083e8;
            --amplify-primary-tint: #006ec2;
            --amplify-primary-shade: #006ec2;
          }
        `}
      </style>
      <AmplifyAuthenticator>
        <AmplifySignIn slot="sign-in" usernameAlias="email" />
        <AmplifySignUp slot="sign-up" usernameAlias="email" formFields={[{ type: 'email' }, { type: 'password' }]} />
      </AmplifyAuthenticator>
    </>
  );
};

export default AuthPage;

// <AmplifyConfirmSignUp slot="confirm-sign-up" usernameAlias="email" />
// <AmplifyConfirmSignIn slot="confirm-sign-in" usernameAlias="email" />
// <AmplifyForgotPassword slot="forgot-password" usernameAlias="email" />
// <AmplifyRequireNewPassword slot="require-new-password" usernameAlias="email" />
