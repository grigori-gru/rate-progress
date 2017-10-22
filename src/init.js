import debug from 'debug';
import getModels from './models';
import connect from './db';

const logger = debug('models');

export default async (isTrue) => {
  const models = getModels(connect);
  await Promise.all(Object.values(models).map(async (model) => {
    await model.sync({ force: isTrue });
    logger(`${model} created`);
  }));
};
