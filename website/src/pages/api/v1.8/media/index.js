import { withSSRContext, Predicates, SortDirection } from 'aws-amplify';

import { Media } from 'src/models';

const PAGINATION_LIMIT = 5;

const MediaList = async (req, res) => {
  const { DataStore } = withSSRContext(req);
  const {
    query: { page = 1 },
  } = req;

  global.pages = global.pages ?? Math.ceil((await DataStore.query(Media, Predicates.ALL)).length / PAGINATION_LIMIT);

  const media = await DataStore.query(Media, Predicates.ALL, {
    page: parseInt(page, 10) - 1,
    limit: PAGINATION_LIMIT,
    sort: s => s.updatedAt(SortDirection.DESCENDING).title(SortDirection.DESCENDING),
  });

  res.statusCode = 200;
  res.json({
    media,
    page,
    pages: global.pages,
  });
};

export default MediaList;
