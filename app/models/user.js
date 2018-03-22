module.exports = function (sequelize, DataTypes) {

  var User = sequelize.define('User', {
    ID: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    display_name: DataTypes.STRING,
    user_login: DataTypes.STRING,
    user_nicename: DataTypes.STRING,
    user_email: DataTypes.STRING,
    user_registered: DataTypes.DATE

  }, {
    classMethods: {
      associate: function (models) {
        User.hasMany(models.Timetrack, {as: 'timetracks', foreignKey: 'user_id', sourceKey: 'ID' });
        User.belongsToMany(models.Project,  {as: 'projects', through: 'ProjectUserRelationship', foreignKey: 'user_id', otherKey: 'project_id'});
        User.hasMany(models.Task, { as: 'tasks', foreignKey: 'assigned_user_id', sourceKey: 'ID' });
      }
    },
    tableName: 'lamos_users',
    freezeTableName: true,
    timestamps: false,
    underscored: true
  }
);

  return User;
};

