// Example model


module.exports = function (sequelize, DataTypes) {

  var Project = sequelize.define('Project', {
    project_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    project_number: DataTypes.STRING,
    project_name: DataTypes.STRING,
    project_status: DataTypes.STRING,
    project_slug: DataTypes.STRING,
    create_date: DataTypes.DATE,
    project_type: DataTypes.STRING,
    project_subtype_id: DataTypes.INTEGER,
    sticky: DataTypes.INTEGER,
    jira_project_id: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function (models) {
        // Project.belongsTo(models.User, {as: 'closed_by_user', foreignKey: 'closed_by', targetKey: 'ID' });
        Project.belongsToMany(models.User,  {as: 'users', through: 'ProjectUserRelationship', foreignKey: 'project_id', otherKey: 'user_id' });
        Project.hasMany(models.ProjectPhase, {as: 'project_phases', foreignKey: 'project_id' })
      }
    },
    tableName: 'lamos_projects',
    freezeTableName: true,
    timestamps: false,
    underscored: true
  });

  return Project;
};
