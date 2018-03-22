// Example model


module.exports = function (sequelize, DataTypes) {

  var Timetrack = sequelize.define('Timetrack', {
    timetrack_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    start: DataTypes.DATE,
    stop: DataTypes.DATE,
    user_id: DataTypes.INTEGER,
    project_id: DataTypes.INTEGER,
    project_phase_id: DataTypes.INTEGER,
    task_id: DataTypes.INTEGER,
    description: DataTypes.STRING,
    time_in_sec: DataTypes.INTEGER,
  }, {
    classMethods: {
      associate: function (models) {
        Timetrack.belongsTo(models.User, {as: 'user', foreignKey: 'user_id', targetKey: 'ID' });
        Timetrack.belongsTo(models.Project, {as: 'project', foreignKey: 'project_id', targetKey: 'project_id' });
        Timetrack.belongsTo(models.ProjectPhase, {as: 'project_phase', foreignKey: 'project_phase_id', targetKey: 'project_phase_id' });
      }
    },
    tableName: 'lamos_timetracks',
    freezeTableName: true,
    timestamps: false,
    underscored: true
  });

  return Timetrack;
};
