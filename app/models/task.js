// Example model


module.exports = function (sequelize, DataTypes) {

    var Task = sequelize.define('Task', {
        task_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        task_parent_id: DataTypes.DATE,
        assigned_user_id: DataTypes.INTEGER,
        project_id: DataTypes.INTEGER,
        project_phase_id: DataTypes.INTEGER,
        jira_issue_id: DataTypes.INTEGER,
        title: DataTypes.STRING,
        created: {
            type: DataTypes.DATE,
            defaultValue: new Date()
        },
        updated: {
            type: DataTypes.DATE,
            defaultValue: new Date()
        },
        opened: {
            type: DataTypes.DATE,
            defaultValue: new Date()
        },
        closed: DataTypes.DATE,
        type: DataTypes.STRING,
        status: DataTypes.STRING,
        number: DataTypes.STRING,
        story_points: DataTypes.INTEGER,

    }, {
            classMethods: {
                associate: function (models) {
                    Task.belongsTo(models.User, { as: 'user', foreignKey: 'assigned_user_id', targetKey: 'ID' });
                    Task.belongsTo(models.Project, { as: 'project', foreignKey: 'project_id', targetKey: 'project_id' });
                }
            },
            tableName: 'lamos_tasks',
            freezeTableName: true,
            timestamps: false,
            underscored: true
        });

    return Task;
};
