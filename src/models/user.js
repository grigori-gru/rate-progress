import Sequelize from 'sequelize';

export default connect => connect.define('user', {
  name: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
});
