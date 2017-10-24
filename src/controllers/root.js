import debug from 'debug';
import Sequelize from 'sequelize';
import models from '../models';

const logger = debug('root');
const { Op } = Sequelize;

export default (router) => {
  router
    .get('root', '/', async (ctx) => {
      logger('GET /');
      const { query } = ctx.request;
      try {
        const users = await models.User.findAll({
          include: [{
            model: models.PrevUser,
            as: 'prevUser',
            where: {
              [Op.or]: [{ is_current: true }, { date: new Date(query.date).toString() }],
            },
          }],
        }).map(({ name, prevUser }) => {
          const newPrev = prevUser.reduce((acc, value) => {
            if (value.is_current) {
              return { ...acc, rate: value.rate, points: value.points };
            }
            return { ...acc, prevRate: value.rate, prevPoints: value.points };
          }, {});

          return { name, ...newPrev };
        });

        const allDate = await models.PrevUser.findAll({ attributes: ['date'] }).map(item => item.date.toString());
        const date = [...new Set(allDate)];
        users.sort((a, b) => a.rate - b.rate);
        await ctx.render('index', { users, date });
      } catch (e) {
        logger('error', e);
      }
    });
};
