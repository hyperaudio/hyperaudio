const handler = async ({ method, url, query, headers, body, trailers }, res) =>
  res.status(200).json({ method, url, query, headers, body, trailers });

export default handler;
