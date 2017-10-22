import debug from 'debug';
import Sequelize from 'sequelize';

const logger = debug('root');
const { Op } = Sequelize;

export default (router, { User, PrevUser }) => {
  router
    .get('root', '/', async (ctx) => {
      logger('GET /');
      const { query } = ctx.request;
      const users = await User.findAll({
        include: [{
          model: PrevUser,
          as: 'prev',
          where: {
            [Op.or]: [{ is_current: true }, { date: new Date(query.date).toString() }],
          },
        }],
      }).map(({ name, prev }) => {
        const newPrev = prev.reduce((acc, value) => {
          if (value.is_current) {
            return { ...acc, rate: value.rate, points: value.points };
          }
          return { ...acc, prevRate: value.rate, prevPoints: value.points };
        }, {});

        return { name, ...newPrev };
      });

      const allDate = await PrevUser.findAll({ attributes: ['date'] }).map(item => item.date.toString());
      const date = [...new Set(allDate)];
      users.sort((a, b) => a.rate - b.rate);
      await ctx.render('index', { users, date });
    });
};
