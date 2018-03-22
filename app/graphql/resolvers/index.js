const path = require('path');
const { mergeResolvers, fileLoader } = require('merge-graphql-schemas');
const { GraphQLDate, GraphQLTime, GraphQLDateTime } = require('graphql-iso-date');

const dateTypeResolvers = {
  DateTime: GraphQLDateTime,
  Time: GraphQLTime,
  Date: GraphQLDate
}

const resolversArray = fileLoader(path.join(__dirname, '.'));

module.exports = mergeResolvers(resolversArray, dateTypeResolvers);
