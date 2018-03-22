const db = require('../../models')
const graphqlFields = require('graphql-fields');
const { requiresAuth } = require('../../permissions');

module.exports = {
  Query: {
    task: requiresAuth.createResolver((parent, {id}, context, info) => {
      let query = {
        where: {task_id: id}
      }
      return db.Task.findOne(query)
    })
  },
  Mutation: {
    addTask: (parent, { project_id, title, type, story_points, assigned_user_id = 0 }, context, info) => {
      return db.Task.create({ project_id, title, type, story_points, assigned_user_id }).then(data => data);
    },
  }
}

