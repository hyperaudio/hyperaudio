import Amplify, { Auth, DataStore, syncExpression } from 'aws-amplify';
import Head from 'next/head';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import { AmplifyProvider, Authenticator, createTheme } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import { User } from '../../models';

// https://ui.docs.amplify.aws/theming
const theme = createTheme({
  name: 'hyperaudio-theme',
  overrides: [
    {
      colorMode: 'dark',
      tokens: {
        colors: {
          font: {
            primary: { value: 'red' },
          },
        },
      },
    },
  ],
});

const getUser = async (setUser, identityId) => {
  // DataStore.configure({
  //   syncExpressions: [
  //     syncExpression(User, () => {
  //       return user => user.identityId('eq', identityId);
  //     }),
  //   ],
  // });

  const user = await DataStore.query(User, user => user.identityId('eq', identityId), { limit: 1 });
  setUser(Array.isArray(user) ? user[0] : user);
};

const Redirect = ({ user }) => {
  const router = useRouter();
  const {
    query: { redirect = '/' },
  } = router;

  console.log({ user });

  useEffect(() => {
    (async () => {
      let {
        attributes: { sub: identityId, email } = {},
        signInUserSession: {
          idToken: { payload },
        },
      } = user;

      if (!identityId) identityId = payload.sub; // FIXME this is not the actual identityId
      if (!email) email = payload.email;

      await getUser(async user => {
        let newUser = false;

        if (!user) {
          newUser = true;
          console.log(
            'new user',
            await DataStore.save(
              new User({ identityId, name: email.split('@')[0], metadata: { lastLogin: new Date() } }),
            ),
          );
        } else {
          console.log('existing user', user);
          await DataStore.save(
            User.copyOf(user, updated => {
              updated.metadata = { ...(user.metadata ?? {}), lastLogin: new Date() };
            }),
          );
        }

        setTimeout(() => {
          console.log('redirect', redirect);
          if (newUser) {
            window.location.href = redirect;
          } else {
            router.push(redirect);
          }
        }, 0);
      }, identityId);
    })();
  }, [redirect, router, user]);

  return (
    <p style={{ textAlign: 'center' }}>
      Redirecting to <a href={redirect}>{redirect}</a>
    </p>
  );
};

const AuthPage = ({ organisation }) => {
  return (
    <>
      <Head>
        <title>Sign in • {organisation.name} @ hyper.audio</title>
      </Head>
      <AmplifyProvider theme={theme}>
        <div
          style={{
            marginTop: 50,
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Authenticator>{({ signOut, user }) => <Redirect user={user} />}</Authenticator>
        </div>
      </AmplifyProvider>
    </>
  );
};

export default AuthPage;
