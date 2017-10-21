import Sequelize from 'sequelize';

export default connect => connect.define('users', {
  name: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
});
