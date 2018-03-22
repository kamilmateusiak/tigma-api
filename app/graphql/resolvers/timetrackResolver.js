const db = require('../../models')
const graphqlFields = require('graphql-fields');
const { requiresAuth } = require('../../permissions');

module.exports = {
  Query: {
    currentTrack: requiresAuth.createResolver((parent, args, { user }, info) => {
      if (user) {
        const fields = graphqlFields(info);
        let query = {
          where: {
            user_id: user.ID,
            project_phase_id: 380,
            stop: null
          },
          include: []
        }

        return db.Timetrack.findAll(query)
          .then((result) => {
            return result[result.length - 1]
          })
      }
      // not logged in user
      return null;
    }),
  }
}

