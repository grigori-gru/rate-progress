import debug from 'debug';
import axios from './axios';
import HTMLparser from './parser';

const logger = debug('hexlet-request');

export default async (url, { User, PrevUser }, date) => {
  try {
    const { data } = await axios.get(url, { responseType: 'text' });
    // logger('axios data', res.data);
    const users = HTMLparser(data);
    logger('users', users);

    await Promise.all(users.map(async ({ points, rate, name }) => {
      const user = await User.findOne({
        name,
        include: [{
          model: PrevUser,
          as: 'prev',
          where: {
            isCurrent: true,
          },
        }],
      });
      logger('findOne user', user);
      const form = {
        name,
        rate,
        points,
        isCurrent: true,
        date,
      };

      try {
        if (user) {
          logger('update user', user.userId);
          await user.update({
            prev: {
              isCurrent: false,
            },
          }, {
            include: [{
              model: PrevUser,
              as: 'prev',
            }],
          }).then(res => logger('update', res.prev));
          await user.addPrev(form);
          logger('User', await PrevUser.findAll());
        } else {
          logger('no user');
          await User.create({
            name,
            prev: [{
              ...form,
              name,
            }],
          }, {
            include: [{
              model: PrevUser,
              as: 'prev',
            }],
          });
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
