import { withSSRContext } from 'aws-amplify';

import { getItem, setItem } from 'src/util/api';

const handler = async (req, res) => {
  try {
    const {
      method,
      // body,
    } = req;

    const { Auth } = withSSRContext({ req });

    switch (method) {
      case 'GET':
        res.status(200).json({ data: null });
        break;
      default:
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

export default handler;
