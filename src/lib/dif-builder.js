const getRateDif = (after, before) =>
  (before ? `${after}(${before})` : `${after}`);

const getPointsDif = (after, before) => {
  if (!before) {
    return `${after}`;
  }

  const dif = after === before ? 0 : `+${after - before}`;
  return `${after}(${dif})`;
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
    }));
