

module.exports = (sequelize, DataTypes) => {
  var ProjectUserRelationship = sequelize.define('ProjectUserRelationship', {
    project_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER
  }, {
    tableName: 'lamos_project_users',
    freezeTableName: true,
    timestamps: false,
    underscored: true
  });
  return ProjectUserRelationship;
}
