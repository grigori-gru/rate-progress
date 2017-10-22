import Sequelize from 'sequelize';

export default connect => connect.define('prev', {
  name: {
    type: Sequelize.STRING,
  },
  rate: {
    type: Sequelize.INTEGER,
  },
  points: {
    type: Sequelize.INTEGER,
  },
  date: {
    type: Sequelize.STRING,
  },
  is_current: {
    type: Sequelize.BOOLEAN,
  },
});
