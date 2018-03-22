const { apolloExpress, graphiqlExpress } = require('apollo-server');
const { makeExecutableSchema } = require('graphql-tools');
const bodyParser = require('body-parser');
const typeDefs = require('./graphql/types');
const resolvers = require('./graphql/resolvers');

const schema = makeExecutableSchema({ typeDefs, resolvers });

module.exports = (app) => {
  app.use(
    '/graphql',
    bodyParser.json(),
    apolloExpress((req, res) => ({
      schema,
      context: {
        SECRET: process.env.SECRET,
        SECRET_2: process.env.SECRET_2,
        user: req.user,
        res
      }
    }))
  );
  app.use('/graphiql', graphiqlExpress({
      endpointURL: '/graphql'
    })
  );
}
