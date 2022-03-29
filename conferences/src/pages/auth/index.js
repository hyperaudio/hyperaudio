import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Amplify, { Auth, DataStore, syncExpression } from 'aws-amplify';

import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import { User } from '../../models';

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

  console.log(user);

  useEffect(() => {
    (async () => {
      const {
        attributes: { sub: identityId, email },
        signInUserSession: {
          idToken: { payload },
        },
      } = user;

      await getUser(async user => {
        console.log('existing user', user);
        if (!user) {
          console.log('new user', await DataStore.save(new User({ identityId, name: email.split('@')[0] })));
        } else {
          await DataStore.save(
            User.copyOf(user, updated => {
              updated.metadata = { ...(user.metadata ?? {}), lastLogin: new Date() };
            }),
          );
        }

        setTimeout(() => {
          console.log('redirect', redirect);
          // router.push(redirect);
          // window.location.href = redirect;
        }, 100);
      }, identityId);
    })();
  }, [redirect, router, user]);

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
          <Redirect user={user} />
        </div>
      )}
    </Authenticator>
  );
};

export default AuthPage;
