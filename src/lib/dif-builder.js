const getRateDif = (after, before) =>
  (before ? `${after}(${before})` : `${after}`);

const getPointsDif = (after, before) => {
  if (!before) {
    return `${after}`;
  }
  const dif = after === before ? 0 : `+${after - before}`;
  return `${after}(${dif})`;
};

const getStatus = (after, before) => {
  const dif = after - before;
  if (dif === 0) return null;
  return dif > 0 ? 'danger' : 'success';
};

export default users =>
  users
    .sort((a, b) => a.rate - b.rate)
    .map(({
      rate, prevRate, points, prevPoints, name,
    }) => ({
      name,
      rateDif: getRateDif(rate, prevRate),
      pointsDif: getPointsDif(points, prevPoints),
      status: getStatus(rate, prevRate),
    }));
