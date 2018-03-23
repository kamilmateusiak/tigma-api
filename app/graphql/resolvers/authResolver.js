const db = require('../../models')
const graphqlFields = require('graphql-fields');
const Promise = require('bluebird');
const _ = require('lodash');
const { tryLogin } = require('../../auth')

module.exports = {
  Mutation: {
    login: async (parent, { email, password }, { SECRET, SECRET_2, res }) => {
      const { token, refreshToken } = await tryLogin(email, password, SECRET, SECRET_2);
      res.cookie('token', token, { maxAge: 60 * 60 * 24,
        // httpOnly: true
      });
      res.cookie('refresh-token', refreshToken, { maxAge: 60 * 60 * 24 * 7,
        // httpOnly: true
      });
      return true;
    },
    logout: async (parent, data, { res }) => {
      res.clearCookie('token');
      res.clearCookie('refresh-token');
      return true;
    },
  }
}

