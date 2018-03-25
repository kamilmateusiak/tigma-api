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
            stop: null
          }
        }

        return db.Timetrack.findAll(query)
          .then((result) => {
            return result[result.length - 1]
          })
      }
      // not logged in user
      return null;
    }),
  },
  Mutation: {
    stopTrack: requiresAuth.createResolver((parent, args, { user }, info) => {
      if (user) {
        const fields = graphqlFields(info);
        let query = {
          where: {
            user_id: user.ID,
            stop: null
          }
        }

        return db.Timetrack.update({stop: new Date()}, query)
          .then(updated => {
            console.log(updated)
            if (updated[0] === 1) {
              return true;
            }
            return false;
          })
      }
      // not logged in user
      return null;
    }),
    startTrack: requiresAuth.createResolver((parent, { description, project_id }, { user }, info) => {
      if (user) {
        const fields = graphqlFields(info);
        let query = {
          user_id: user.ID,
          start: new Date(),
          description,
          project_id
        };

        return db.Timetrack.create(query)
      }
      // not logged in user
      return null;
    })
  }
}

