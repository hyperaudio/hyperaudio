import { connectToDatabase } from '../../../../util/database';

export default async (req, res) => {
  const { client } = await connectToDatabase();
  const isConnected = await client.isConnected();

  res.statusCode = 200;
  res.json({ isConnected });
};
