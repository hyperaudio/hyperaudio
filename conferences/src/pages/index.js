import React, { useState, useCallback, useEffect, useReducer } from 'react';
import { Auth, DataStore, syncExpression, withSSRContext } from 'aws-amplify';
import { serializeModel, deserializeModel } from '@aws-amplify/datastore/ssr';
import { NoSsr } from '@mui/base';
import Head from 'next/head';

import { User } from '../models';

const HomePage = () => {
  return (
    <div>
      <Head>
        <title>Hyperaudio</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Hyperaudio</h1>
      </main>
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
    // return { redirect: { destination: '/auth/?redirect=/account', permanent: false } };
  }
};

export default HomePage;
