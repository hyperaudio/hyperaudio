import React, { useState, useCallback, useEffect, useReducer } from 'react';
import { Auth, DataStore, syncExpression, withSSRContext } from 'aws-amplify';
import { serializeModel, deserializeModel } from '@aws-amplify/datastore/ssr';
import NoSsr from '@mui/material/NoSsr';

import { AccountView } from '@hyperaudio/app';

import { User } from '../../models';

const getUser = async (dispatch, identityId) => {
  DataStore.configure({
    syncExpressions: [
      syncExpression(User, () => {
        return user => user.identityId('eq', identityId);
      }),
    ],
  });

  const user = await DataStore.query(User, user => user.identityId('eq', identityId), { limit: 1 });
  dispatch({ type: 'loadUser', payload: Array.isArray(user) ? user[0] : user });
};

export const userReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case 'loadUser':
      return { user: payload };
    case 'updateName':
      return { ...state, name: payload };
    case 'updateBio':
      return { ...state, bio: payload };
    case 'save':
      DataStore.save(
        User.copyOf(state.user, updated => {
          updated.name = state.name ?? updated.name;
          updated.bio = state.bio ?? updated.bio;
        }),
      );
      return state;
    default:
      throw new Error(`unhandled action ${type}`, action);
  }
};

const AccountPage = initialData => {
  const { identityId } = initialData;
  const [{ user, name, bio }, dispatch] = useReducer(userReducer, {
    user: initialData.user ? deserializeModel(User, initialData.user) : null,
  });

  useEffect(() => identityId && getUser(dispatch, identityId), [identityId]);

  useEffect(() => {
    const subscription = DataStore.observe(User).subscribe(() => identityId && getUser(dispatch, identityId));
    return () => subscription.unsubscribe();
  }, [identityId]);

  return (
    <div>
      <NoSsr>
        <AccountView
          account={{
            name: name ?? user?.name ?? '',
            bio: bio ?? user?.bio ?? '',
          }}
          dispatch={dispatch}
        />
      </NoSsr>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
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
