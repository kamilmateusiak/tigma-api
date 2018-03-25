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
    summary: requiresAuth.createResolver(async (parent, args, { user }, info) => {
      if (user) {
        let query = {
          where: {ID: user.ID},
          include: []
        }
        const timetrackMonth = await db.sequelize.query(`
          SELECT
            SUM(TIMESTAMPDIFF(SECOND, t.start, t.stop)*1000) as time_month
          FROM
            lamos_timetracks t
          WHERE
            t.user_id = ${user.ID} AND MONTH(t.start) = ${new Date().getMonth() + 1}
          AND
            YEAR(t.start) = ${new Date().getFullYear()}`);
        const timetrackDay = await db.sequelize.query(`
          SELECT
            SUM(TIMESTAMPDIFF(SECOND, t.start, t.stop)*1000) as time_day
          FROM
            lamos_timetracks t
          WHERE
            t.user_id = ${user.ID} AND MONTH(t.start) = ${new Date().getMonth() + 1}
          AND
            YEAR(t.start) = ${new Date().getFullYear()}
          AND
            DAY(t.start) = ${new Date().getDate()}`);

        return {
          time_month: timetrackMonth[0][0].time_month || 0,
          time_day: timetrackDay[0][0].time_day || 0
        }
      }
      return {
        time_month: 0,
        time_day: 0
      };
    })
  }
}

