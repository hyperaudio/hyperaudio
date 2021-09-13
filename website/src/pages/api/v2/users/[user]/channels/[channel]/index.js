const channel = async (req, res) => {
  res.status(200).json({ user: req?.query?.user, channel: req?.query?.channel });
};

export default channel;
