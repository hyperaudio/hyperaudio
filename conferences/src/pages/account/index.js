import React, { useState, useCallback, useEffect } from 'react';
import { Auth, DataStore, syncExpression, withSSRContext } from 'aws-amplify';
import { serializeModel, deserializeModel } from '@aws-amplify/datastore/ssr';

import { User } from '../../models';

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

const AccountPage = initialData => {
  const { identityId } = initialData;
  const [user, setUser] = useState(initialData.user ? deserializeModel(User, initialData.user) : null);

  useEffect(() => identityId && getUser(setUser, identityId), [identityId]);

  useEffect(() => {
    const subscription = DataStore.observe(User).subscribe(() => identityId && getUser(setUser, identityId));
    return () => subscription.unsubscribe();
  }, [identityId]);

  return <pre>{JSON.stringify(user, null, 2)}</pre>;
};

export const getServerSideProps = async context => {
  const { Auth, DataStore } = withSSRContext(context);

  try {
    const {
      attributes: { sub: identityId },
      signInUserSession: {
        accessToken: {
          payload: { 'cognito:groups': groups },
        },
      },
    } = await Auth.currentAuthenticatedUser();

    console.log(identityId, groups);

    DataStore.configure({
      syncExpressions: [
        syncExpression(User, () => {
          return user => user.identityId('eq', identityId);
        }),
      ],
    });

    const user = serializeModel(await DataStore.query(User, user => user.identityId('eq', identityId))).pop() ?? null;

    return { props: { identityId, groups, user } };
  } catch (error) {
    console.error(error);
    return { redirect: { destination: '/auth/?redirect=/account', permanent: false } };
  }
};

export default AccountPage;
