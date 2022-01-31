import React, { useState, useCallback, useEffect } from 'react';
import { Auth, DataStore, syncExpression, withSSRContext } from 'aws-amplify';
import { serializeModel, deserializeModel } from '@aws-amplify/datastore/ssr';
import { NoSsr } from '@mui/base';

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
  console.log({ props });

  const { identityId } = props;
  const [user, setUser] = useState(props.user ? deserializeModel(User, props.user) : null);

  useEffect(() => identityId && getUser(setUser, identityId), [identityId]);

  useEffect(() => {
    const subscription = DataStore.observe(User).subscribe(() => identityId && getUser(setUser, identityId));
    return () => subscription.unsubscribe();
  }, [identityId]);

  return (
    user && (
      <NoSsr>
        <Topbar
          account={{
            displayName: user.name,
          }}
          organization={{
            name: 'Mozilla Festival',
            slug: '/mozfest-2022',
          }}
        />
      </NoSsr>
    )
  );
};

export default Header;
