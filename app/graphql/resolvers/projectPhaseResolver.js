const db = require('../../models');
const graphqlFields = require('graphql-fields');
const Promise = require('bluebird');
const _ = require('lodash');

module.exports = {
  Query: {
    projectPhases: async (parent, {state}, context, info) => {
      const fields = graphqlFields(info);
      const acceptedStates = ['active', 'future', 'closed'];

      let query = {};
      // where
      if (state !== 'all' && acceptedStates.indexOf(state) > -1) {
        query.where = { phase_state: state }
      }

      // include
      query.include = [];


      if (typeof fields.project !== 'undefined') {
        query.include.push({model : db.Project, as : 'project'});
      }


      if (typeof fields.timetracks !== 'undefined' || typeof fields.users_time !== 'undefined') {
        let timetracksInclude = {model : db.Timetrack, as : 'timetracks'};
        timetracksInclude.include = [
          {model : db.User, as : 'user'}
        ]
        query.include.push(timetracksInclude);
      }

      if (typeof fields.tasks !== 'undefined') {
        let tasksInclude = {model : db.Task, as : 'tasks'};

        if (typeof fields.tasks.user !== 'undefined') {
          tasksInclude.include = [
            {model : db.User, as : 'user'}
          ]
        }
        query.include.push(tasksInclude);
      }

      const phases = await db.ProjectPhase.findAll(query);

      if (typeof fields.users_time !== 'undefined') {
        return _.map(phases, (phase) => {
          let usersTime = _.reduce(phase.timetracks, function(result, track) {
            let singleTime = _.find(result, el => el.ID === track.user.ID);
            const timelapse = new Date(track.stop) - new Date(track.start)
            if (!isNaN(timelapse)) {
              if (singleTime === undefined) {
                const { ID, display_name } = track.user;
                singleTime = {
                  ID,
                  display_name,
                  time: timelapse
                }
                result.push(singleTime)
              } else {
                singleTime.time += timelapse
              }
            }
            return result;
          }, []);

          return {...phase.dataValues, users_time: usersTime}
        });

      }
      return phases;

    }
  }
}
