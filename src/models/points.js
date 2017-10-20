import Sequelize from 'sequelize';

export default connect => connect.define('points', {
  currentPoints: {
    type: Sequelize.INTEGER,
  },
  prevPoints: {
    type: Sequelize.INTEGER,
  },
});
