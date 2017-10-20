import logger from 'debug';
import getModels from './models';
import connect from './db';

export default async (isTrue) => {
  logger('models');
  const models = getModels(connect);
  await Promise.all(Object.values(models).map(model => model.sync({ force: isTrue })));
};
