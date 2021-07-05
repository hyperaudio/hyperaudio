import { withSSRContext } from 'aws-amplify';
import { serializeModel } from '@aws-amplify/datastore/ssr';

import { User } from '../../../models';

const whoami = async (req, res) => {
  const { Auth, DataStore } = withSSRContext({ req });

  let user = null;

  try {
    const {
      attributes: { sub },
    } = await Auth.currentAuthenticatedUser();
    user = serializeModel(await DataStore.query(User, sub));
    // console.log({ user, sub });
  } catch (error) {
    console.error(error);
  }

  res.statusCode = 200;
  res.json({ user });
};

export default whoami;
