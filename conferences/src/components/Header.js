import React, { useState, useCallback, useEffect } from 'react';
import { Auth, DataStore, syncExpression } from 'aws-amplify';
import { deserializeModel } from '@aws-amplify/datastore/ssr';
import { NoSsr } from '@mui/base';
import { useRouter } from 'next/router';

import { Topbar } from '@hyperaudio/app';

import { User } from '../models';

const getUser = async (setUser, identityId) => {
  DataStore.configure({
    syncExpressions: [
      syncExpression(User, () => {
        return user => user.identityId('eq', identityId);
      }),
    ],
  });

  const user = await DataStore.query(User, user => user.identityId('eq', identityId), { limit: 1 });
  setUser(Array.isArray(user) ? user[0] : user);
};

const Header = props => {
  const router = useRouter();

  const { identityId } = props;
  const [user, setUser] = useState(props.user ? deserializeModel(User, props.user) : null);

  useEffect(() => identityId && getUser(setUser, identityId), [identityId]);

  useEffect(() => {
    const subscription = DataStore.observe(User).subscribe(() => identityId && getUser(setUser, identityId));
    return () => subscription.unsubscribe();
  }, [identityId]);

  const navigateToAccountPage = useCallback(() => router.push('/account'), [router]);
  const logoutToHomePage = useCallback(async () => {
    await Auth.signOut({ global: true });
    window.location.href = '/';
  }, []);

  return (
    <NoSsr>
      <Topbar
        account={
          user
            ? {
                name: user.name,
              }
            : null
        }
        organization={{
          name: 'Mozilla Festival',
          slug: '/',
        }}
        navigateToAccountPage={navigateToAccountPage}
        logoutToHomePage={logoutToHomePage}
      />
    </NoSsr>
  );
};

export default Header;
