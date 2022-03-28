import React, { useState, useCallback, useEffect, useReducer } from 'react';
import { Auth, DataStore, syncExpression, withSSRContext } from 'aws-amplify';
import { serializeModel, deserializeModel } from '@aws-amplify/datastore/ssr';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CheckIcon from '@mui/icons-material/Check';
import NoSsr from '@mui/material/NoSsr';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

import { Main } from '../../components';
import { User } from '../../models';

const PREFIX = `AccountView`;
const classes = {
  root: `${PREFIX}-Root`,
};

const Root = styled('div', {})(({ theme }) => ({}));

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

  console.log('HERE WE ARE', { type, payload });

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

  const handleNameChange = useCallback(
    ({ target: { value } }) => dispatch({ type: 'updateName', payload: value }),
    [dispatch],
  );
  const handleBioChange = useCallback(
    ({ target: { value } }) => dispatch({ type: 'updateBio', payload: value }),
    [dispatch],
  );
  const handleSave = useCallback(() => dispatch({ type: 'save' }), [dispatch]);

  useEffect(() => identityId && getUser(dispatch, identityId), [identityId]);
  useEffect(() => {
    const subscription = DataStore.observe(User).subscribe(() => identityId && getUser(dispatch, identityId));
    return () => subscription.unsubscribe();
  }, [identityId]);

  console.group('AccountPage');
  console.log({ user, dispatch });
  console.groupEnd();

  return (
    <>
      <Main>
        <NoSsr>
          <Root className={classes.root}>
            <Typography variant="h5" component="h1" gutterBottom>
              Account details
            </Typography>
            <form sx={{ mt: 3 }} onSubmit={e => e.preventDefault()}>
              <TextField
                fullWidth
                id="outlined-basic"
                label="Display name"
                margin="normal"
                name="displayName"
                placeholder="Display name"
                required
                value={name ?? user?.name ?? ''}
                variant="outlined"
                onChange={handleNameChange}
              />
              <TextField
                fullWidth
                id="outlined-basic"
                label="Bio"
                margin="normal"
                maxRows={5}
                minRows={1}
                multiline
                name="bio"
                placeholder="Short bio"
                value={bio ?? user?.bio ?? ''}
                variant="outlined"
                onChange={handleBioChange}
              />
              <Box sx={{ mt: 3 }}>
                <Button
                  color="primary"
                  onClick={handleSave}
                  size="large"
                  startIcon={<CheckIcon fontSize="small" />}
                  variant="contained"
                >
                  Save
                </Button>
              </Box>
            </form>
          </Root>
        </NoSsr>
        {/* <pre>{JSON.stringify(user, null, 2)}</pre> */}
      </Main>
    </>
  );
};

// export const getServerSideProps = async context => {
//   const { Auth, DataStore } = withSSRContext(context);

//   try {
//     const {
//       attributes: { sub: identityId },
//       signInUserSession: {
//         accessToken: {
//           payload: { 'cognito:groups': groups },
//         },
//       },
//     } = await Auth.currentAuthenticatedUser();

//     console.log(identityId, groups);

//     DataStore.configure({
//       syncExpressions: [
//         syncExpression(User, () => {
//           return user => user.identityId('eq', identityId);
//         }),
//       ],
//     });

//     const user = serializeModel(await DataStore.query(User, user => user.identityId('eq', identityId))).pop() ?? null;

//     return { props: { identityId, groups, user } };
//   } catch (error) {
//     console.error(error);
//     return { redirect: { destination: '/auth/?redirect=/account', permanent: false } };
//   }
// };

export default AccountPage;
