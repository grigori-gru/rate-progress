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
      const prevUser = await PrevUser.findOne({
        where: {
          name,
          is_current: true,
        },
      });
      // logger('findOne user', prevUser);
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
          await PrevUser.create({ ...form, userId: prevUser.userId });
          // logger('User', await PrevUser.findAll());
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
