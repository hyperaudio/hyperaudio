import { withSSRContext } from 'aws-amplify';

import { getItem, setItem } from 'src/util/api';

const item = async (req, res) => {
  try {
    const {
      query: { pk, sk },
      method,
      body,
    } = req;

    const { Auth } = withSSRContext({ req });

    switch (method) {
      case 'GET':
        res.status(200).json({ data: (await getItem(pk, sk))?.Item });
        break;
      case 'PUT':
        res.status(200).json({
          data: (await setItem(pk, sk, JSON.parse(body), (await Auth.currentAuthenticatedUser())?.attributes?.sub))
            ?.Item,
        });
        break;
      default:
        res.setHeader('Allow', ['GET', 'PUT']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

export default item;
