const userChannels = async (req, res) => {
  res.status(200).json({ user: req?.query?.user, channels: [] });
};

export default userChannels;
