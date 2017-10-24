import debug from 'debug';
import axios from './axios';
import HTMLparser from './parser';
import models from '../models';

const logger = debug('hexlet-request');

export default async (url, date) => {
  try {
    const { data } = await axios.get(url, { responseType: 'text' });
    // logger('axios data', res.data);
    const users = HTMLparser(data);
    logger('users', users);

    await Promise.all(users.map(async ({ points, rate, name }) => {
      const prevUser = await models.PrevUser.findOne({
        where: {
          name,
          is_current: true,
        },
      });
      logger('findOne user', prevUser);
      const form = {
        name,
        rate,
        points,
        is_current: true,
        date,
      };

      try {
        if (prevUser) {
          logger('update user', prevUser.userId);
          await prevUser.update({
            is_current: false,
          });
          await models.PrevUser.create({ ...form, userId: prevUser.userId });
          // logger('User', await PrevUser.findAll());
        } else {
          logger('no user');
          await models.User.create({
            name,
            prevUser: [{
              ...form,
              name,
            }],
          }, {
            include: [{
              model: models.PrevUser,
              as: 'prevUser',
            }],
          }).then(res => logger(`${res.name} created`));
        }
      } catch (e) {
        logger('error in db creating', e);
      }
    }));
    logger('DB update');
  } catch (e) {
    logger('Error!', e);
  }
};
