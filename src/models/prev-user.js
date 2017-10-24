export default (sequelize, DataTypes) => {
  const PrevUser = sequelize.define('PrevUser', {
    name: {
      type: DataTypes.STRING,
    },
    rate: {
      type: DataTypes.INTEGER,
    },
    points: {
      type: DataTypes.INTEGER,
    },
    date: {
      type: DataTypes.STRING,
    },
    is_current: {
      type: DataTypes.BOOLEAN,
    },
  });

  PrevUser.associate = (models) => {
    PrevUser.belongsTo(models.User, {
      foreignKey: 'userId',
    });
  };

  return PrevUser;
};
