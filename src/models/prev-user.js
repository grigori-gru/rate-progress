import Sequelize from 'sequelize';

export default connect => connect.define('prevs', {
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
  isCurrent: {
    type: Sequelize.BOOLEAN,
  },
});
