import axios from 'axios';

const APIProxy = async ({ query: { segments } }, res) => {
  const { data } = await axios.get(`https://api.hyperaud.io/${segments.join('/')}`);

  res.status(200).json(data);
};

export default APIProxy;
