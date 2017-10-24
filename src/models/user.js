export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
  });

  User.associate = (models) => {
    User.hasMany(models.PrevUser, {
      foreignKey: 'userId',
      as: 'prevUser',
    });
  };

  return User;
};
