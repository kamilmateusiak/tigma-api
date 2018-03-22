// Example model


module.exports = (sequelize, DataTypes) => {

  const ProjectPhase = sequelize.define('ProjectPhase', {
    project_phase_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    project_id: DataTypes.INTEGER,
    phase_name: DataTypes.STRING,
    description: DataTypes.STRING,
    phase_state: DataTypes.STRING,
    phase_start: DataTypes.DATE,
    phase_end: DataTypes.DATE,
    jira_sprint_id: DataTypes.INTEGER,
    token: DataTypes.STRING,
    closed: DataTypes.INTEGER,
    closed_by: DataTypes.INTEGER,
    closed_date: DataTypes.DATE
  }, {
    classMethods: {
      associate: models => {
        ProjectPhase.belongsTo(models.User, {as: 'closed_by_user', foreignKey: 'closed_by', targetKey: 'ID' });
        ProjectPhase.belongsTo(models.Project, {as: 'project', foreignKey: 'project_id', targetKey: 'project_id' });
        ProjectPhase.hasMany(models.Timetrack, {as: 'timetracks', foreignKey: 'project_phase_id' });
        ProjectPhase.hasMany(models.Task, {as: 'tasks', foreignKey: 'project_phase_id' });
      }
    },
    tableName: 'lamos_project_phases',
    freezeTableName: true,
    timestamps: false,
    underscored: true
  });

  return ProjectPhase;
};
