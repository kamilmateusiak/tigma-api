const db = require('../../models')
const graphqlFields = require('graphql-fields');
const { requiresAuth } = require('../../permissions');

module.exports = {
  Query: {
    users: () => {
      return db.User.findAll()
    },
    user: (parent, {id}, context, info) => {
      const fields = graphqlFields(info);
      let query = {
        where: {ID: id},
        include: []
      }

      if (typeof fields.timetracks !== 'undefined') {
        const timetracksInclude = { model: db.Timetrack, as: 'timetracks'}
        if (typeof fields.timetracks.project !== 'undefined')
        timetracksInclude.include = [{
          model: db.Project, as: 'project'
        }]
        query.include.push(timetracksInclude);
        query.order = [[{model : db.Timetrack, as : 'timetracks'}, 'start', 'DESC']]
      }

      if (typeof fields.projects !== 'undefined') {
        query.include.push({model: db.Project, as: 'projects'})
      }

      if (typeof fields.tasks !== 'undefined') {
        query.include.push({ model: db.Task, as: 'tasks' })
      }

      return db.User.findOne(query)
    },
    me: requiresAuth.createResolver((parent, args, { user }, info) => {
      if (user) {
        const fields = graphqlFields(info);
        let query = {
          where: {ID: user.ID},
          include: []
        }

        if (typeof fields.timetracks !== 'undefined') {
          const timetracksInclude = { model: db.Timetrack, as: 'timetracks'}
          if (typeof fields.timetracks.project !== 'undefined')
          timetracksInclude.include = [{
            model: db.Project, as: 'project'
          }]
          query.include.push(timetracksInclude);
          query.order = [[{model : db.Timetrack, as : 'timetracks'}, 'start', 'DESC']]
        }

        if (typeof fields.projects !== 'undefined') {
          query.include.push({model: db.Project, as: 'projects'})
        }

        if (typeof fields.tasks !== 'undefined') {
          query.include.push({ model: db.Task, as: 'tasks' })
        }

        return db.User.findOne(query)
      }
      // not logged in user
      return null;
    }),
  }
}

