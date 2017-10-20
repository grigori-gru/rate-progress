import Sequelize from 'sequelize';

export default connect => connect.define('rate', {
  currentRate: {
    type: Sequelize.INTEGER,
  },
  prevRate: {
    type: Sequelize.INTEGER,
  },
});
