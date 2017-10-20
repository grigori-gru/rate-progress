import getUser from './user';
import getPrevUser from './prev-user';

export default (content) => {
  const m = {
    PrevUser: getPrevUser(content),
    User: getUser(content),
  };

  m.User.hasMany(m.PrevUser, { as: 'prev' });
  return m;
};
