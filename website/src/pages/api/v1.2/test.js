/* eslint-disable import/no-anonymous-default-export */
import { connectToDatabase } from 'src/util/database';

export default async (req, res) => {
  const { client } = await connectToDatabase();
  const isConnected = await client.isConnected();

  console.log(process.env);

  res.status(200).json({ isConnected });
};
