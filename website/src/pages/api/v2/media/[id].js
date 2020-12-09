import { withSSRContext } from 'aws-amplify';

import { Media } from 'src/models';

const MediaList = async (req, res) => {
  const { DataStore } = withSSRContext(req);
  const {
    query: { id },
  } = req;

  const media = await DataStore.query(Media, id);

  res.statusCode = 200;
  res.json(media);
};

export default MediaList;
