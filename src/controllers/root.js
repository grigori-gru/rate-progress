import debug from 'debug';
import Sequelize from 'sequelize';

const logger = debug('root');
const { Op } = Sequelize;

export default (router, { User, PrevUser }) => {
  router
    .get('root', '/', async (ctx) => {
      logger('GET /');
      const { query } = ctx.request;
      logger('query', query);
      logger(new Date(query.date));
      const users = await User.findAll({
        include: [{
          model: PrevUser,
          as: 'prev',
          where: {
            [Op.or]: [{ isCurrent: true }, { date: new Date(query.date) }],
          },
        }],
      });

      users.map(user => logger('prev', user.prev));
      const allDate = await PrevUser.findAll({ attributes: ['date'] }).map(item => item.date.toString());
      const date = [...new Set(allDate)].map(item => new Date(item));
      logger('date', date);
      users.sort((a, b) => a.prev[0].rate - b.prev[0].rate);
      await ctx.render('index', { users, date });
    });
};
