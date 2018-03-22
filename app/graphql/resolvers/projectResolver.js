const db = require('../../models')
const graphqlFields = require('graphql-fields');
const Promise = require('bluebird');
const _ = require('lodash');

module.exports = {
  Query: {
    project: async (parent, {project_slug}, context, info) => {
      const fields = graphqlFields(info);
      let query = {
        where: {project_slug}
      }
      // include
      query.include = [];

      if (typeof fields.project_phases !== 'undefined') {
        query.include.push({model : db.ProjectPhase, as : 'project_phases'});
      }

      try {
        const project = await db.Project.findOne(query);

        if (typeof fields.project_phases !== 'undefined' && typeof fields.project_phases.time !== 'undefined') {
          const timetracks = await db.Timetrack.findAll({where: { project_id: project.project_id}, include: [{model : db.User, as : 'user'}]})

          const phasesWithTime = project.project_phases.map(phase => {
            const time = _.reduce(timetracks, (result, track) => {
              const timelapse = new Date(track.stop) - new Date(track.start)
              if(track.project_phase_id === phase.project_phase_id && !isNaN(timelapse)) {
                result += timelapse
              }
              return result;
            }, 0);
            return { ...phase.dataValues, time: time };
          });

          const usersTime = _.reduce(timetracks, (result, track) => {
            if (new Date(track.start).getMonth() === 1 && new Date(track.start).getYear() === new Date().getYear()) {
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
            }

            return result;
          }, []);
          return { ...project.dataValues, project_phases: phasesWithTime, users_time: usersTime }
        }

        return project;
      } catch(e) {
        console.log(e)
      }
    }
  }
}

