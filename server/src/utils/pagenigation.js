export const Filter = (query, userId) => {
  const filter = {};

  if (query) {
    filter.title = { $regex: new RegExp(query), $options: "i" };
  }

  if (userId) {
    filter.userId = userId;
  }

  return filter;
};

export const Sort = (sortBy, sortType) => {
  const sort = {};

  if (sortBy) {
    sort[sortBy] = sortType === "desc" ? -1 : 1;
  }

  return sort;
};
